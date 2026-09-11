import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Modality } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

/**
 * Converts raw 16-bit linear PCM audio bytes (24kHz mono) into a valid WAV file buffer.
 */
function pcmToWav(pcmData: Uint8Array, sampleRate = 24000, numChannels = 1): Buffer {
  const byteRate = sampleRate * numChannels * 2;
  const blockAlign = numChannels * 2;
  const dataSize = pcmData.byteLength;
  const wavBuffer = Buffer.alloc(44 + dataSize);

  // RIFF chunk descriptor
  wavBuffer.write("RIFF", 0);
  wavBuffer.writeUInt32LE(36 + dataSize, 4);
  wavBuffer.write("WAVE", 8);

  // "fmt " sub-chunk
  wavBuffer.write("fmt ", 12);
  wavBuffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  wavBuffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  wavBuffer.writeUInt16LE(numChannels, 22); // NumChannels
  wavBuffer.writeUInt32LE(sampleRate, 24); // SampleRate
  wavBuffer.writeUInt32LE(byteRate, 28); // ByteRate
  wavBuffer.writeUInt16LE(blockAlign, 32); // BlockAlign
  wavBuffer.writeUInt16LE(16, 34); // BitsPerSample (16-bit)

  // "data" sub-chunk
  wavBuffer.write("data", 36);
  wavBuffer.writeUInt32LE(dataSize, 40);

  // Write PCM payload
  Buffer.from(pcmData.buffer, pcmData.byteOffset, pcmData.byteLength).copy(wavBuffer, 44);

  return wavBuffer;
}

let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", hasApiKey: Boolean(process.env.GEMINI_API_KEY) });
  });

  // TTS Synthesis endpoint
  app.post("/api/tts", async (req, res) => {
    try {
      const { text, voice = "Kore", tone, multiSpeaker, speaker1, speaker2 } = req.body;

      if (!text || typeof text !== "string" || !text.trim()) {
        return res.status(400).json({ error: "Text prompt is required for speech synthesis." });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: "GEMINI_API_KEY is not configured on the server. Please configure it in Settings > Secrets.",
        });
      }

      const ai = getAi();

      let generateConfig: any = {
        responseModalities: [Modality.AUDIO],
      };

      let promptContent = text.trim();

      if (multiSpeaker && speaker1 && speaker2) {
        generateConfig.speechConfig = {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              {
                speaker: speaker1.name || "Speaker 1",
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: speaker1.voice || "Kore" },
                },
              },
              {
                speaker: speaker2.name || "Speaker 2",
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: speaker2.voice || "Puck" },
                },
              },
            ],
          },
        };
      } else {
        if (tone && tone !== "Default / Natural") {
          promptContent = `Speak with a ${tone.toLowerCase()} tone: ${promptContent}`;
        }
        generateConfig.speechConfig = {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        };
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: promptContent }] }],
        config: generateConfig,
      });

      const audioPart = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      if (!audioPart?.data) {
        return res.status(500).json({
          error: "No audio data received from Gemini Text-to-Speech service.",
        });
      }

      const rawPcmBytes = Buffer.from(audioPart.data, "base64");
      const wavBuffer = pcmToWav(new Uint8Array(rawPcmBytes), 24000, 1);
      const wavBase64 = wavBuffer.toString("base64");

      const durationSeconds = rawPcmBytes.byteLength / (24000 * 2);

      return res.json({
        audioBase64: wavBase64,
        mimeType: "audio/wav",
        sampleRate: 24000,
        durationSeconds: Math.round(durationSeconds * 10) / 10,
        voice: multiSpeaker ? "Multi-Speaker" : voice,
      });
    } catch (err: any) {
      console.error("TTS Generation Error:", err);
      return res.status(500).json({
        error: err.message || "Failed to generate speech audio.",
      });
    }
  });

  // Vite middleware for dev or static server for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TTS Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
