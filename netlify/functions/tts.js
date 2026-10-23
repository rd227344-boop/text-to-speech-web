const { MsEdgeTTS, OUTPUT_FORMAT } = require('edge-tts-universal');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { text, voice } = JSON.parse(event.body);

    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Text is required' }),
      };
    }

    const selectedVoice = voice || 'hi-IN-MadhurNeural';

    const tts = new MsEdgeTTS();
    await tts.setMetadata(selectedVoice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);

    const { audioStream } = tts.toStream(text);

    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="speech.mp3"',
      },
      body: audioBuffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('TTS Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate audio' }),
    };
  }
};
