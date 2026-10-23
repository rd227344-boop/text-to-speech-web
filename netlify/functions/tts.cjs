const { MsEdgeTTS, OUTPUT_FORMAT } = require('edge-tts-universal');
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { text, voice = 'hi-IN-MadhurNeural' } = JSON.parse(event.body || '{}');

    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Text is required' }),
      };
    }

    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_STEREO);

    // Netlify functions only allow writing to /tmp directory
    const tmpFilePath = path.join('/tmp', `audio-${Date.now()}.mp3`);
    
    const filePath = await tts.toStream(text, tmpFilePath);
    const finalPath = filePath || tmpFilePath;

    const audioBuffer = fs.readFileSync(finalPath);

    // Clean up temporary file
    try { 
      fs.unlinkSync(finalPath); 
    } catch (e) {}

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline; filename="speech.mp3"',
      },
      body: audioBuffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Edge TTS Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'TTS generation failed' }),
    };
  }
};
