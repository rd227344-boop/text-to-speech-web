import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("Warning: GEMINI_API_KEY is not set.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

function pcmToWav(pcmData: Uint8Array, sampleRate: number = 24000, numChannels: number = 1): Uint8Array {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // RIFF identifier
  view.setUint32(0, 0x42494646, false); // "RIFF"
  // file length
  view.setUint32(4, 36 + pcmData.length, true);
  // RIFF type
  view.setUint32(8, 0x57415645, false); // "WAVE"
  // format chunk identifier
  view.setUint32(12, 0x666d7420, false); // "fmt "
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (raw PCM)
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, numChannels, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * numChannels * 2, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, numChannels * 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  view.setUint32(36, 0x64617461, false); // "data"
  // data chunk length
  view.setUint32(40, pcmData.length, true);

  const wavBuffer = new Uint8Array(44 + pcmData.length);
  wavBuffer.set(new Uint8Array(header), 0);
  wavBuffer.set(pcmData, 44);

  return wavBuffer;
}

function splitTextIntoChunks(text: string, maxLength: number = 800): string[] {
  if (text.length <= maxLength) return [text];
  
  const sentences = text.match(/[^.!?]+[.!?]+(\s+|$)\vert{}[^.!?]+$/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxLength) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  return chunks;
}

app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice, tone, multiSpeaker, speaker1, speaker2 } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const chunks = splitTextIntoChunks(text);
    const pcmChunks: Uint8Array[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i];
      let promptContent = chunkText;

      let generateConfig: any = {
        responseMimeType: "audio/wav",
      };

      if (multiSpeaker && speaker1 && speaker2) {
        generateConfig.speechConfig = {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              {
                speaker: speaker1.name || "Speaker 1",
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: speaker1.voice || "Puck" }
                }
              },
              {
                speaker: speaker2.name || "Speaker 2",
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: speaker2.voice || "Kore" }
                }
              }
            ]
          }
        };
      } else {
        if (tone && tone !== "Default / Natural") {
          promptContent = `Speak with a ${tone.toLowerCase()} tone: ${chunkText}`;
        }

        generateConfig.speechConfig = {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || "Puck" }
          }
        };
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ parts: [{ text: promptContent }] }],
        config: generateConfig,
      });

      const audioPart = response.candidates?.[0]?.content?.parts?.find(
        (part: any) => part.inlineData?.data
      )?.inlineData;

      if (!audioPart?.data) {
        throw new Error(`No audio data received for chunk ${i + 1}`);
      }

      pcmChunks.push(Buffer.from(audioPart.data, 'base64'));

      if (i < chunks.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    const rawPcmBytes = Buffer.concat(pcmChunks);
    const wavBuffer = pcmToWav(new Uint8Array(rawPcmBytes), 24000, 1);
    const audioBase64 = wavBuffer.toString('base64');
    const durationSeconds = rawPcmBytes.byteLength / (24000 * 2);

    return res.json({
      audioBase64,
      mimeType: "audio/wav",
      sampleRate: 24000,
      durationSeconds: Math.round(durationSeconds * 10) / 10,
      voice: multiSpeaker ? "Multi-Speaker" : voice,
      chunks: chunks.length,
    });
  } catch (err: any) {
    console.error("TTS Generation Error:", err);
    return res.status(500).json({
      error: err.message || "Failed to generate speech audio.",
    });
  }
});

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (_, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`TTS Server listening on http://0.0.0.0:${PORT}`);
});
         
