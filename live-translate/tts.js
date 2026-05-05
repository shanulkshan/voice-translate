const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const OUTPUT_DIR = path.join(__dirname, 'output');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

let counter = 0;

async function synthesizeSinhala(text) {
  try {
    const request = {
      input: { text },
      voice: {
        languageCode: 'si-LK',
      },
      audioConfig: {
        audioEncoding: 'MP3', // keep MP3 for now
      },
    };

    const [response] = await client.synthesizeSpeech(request);

    const fileName = path.join(
      OUTPUT_DIR,
      `audio_${String(counter++).padStart(4, '0')}.mp3`
    );

    fs.writeFileSync(fileName, response.audioContent, 'binary');

    console.log("🔊 Created:", fileName);

    return fileName;

  } catch (err) {
    console.error("❌ TTS Error:", err.message);
  }
}

module.exports = synthesizeSinhala;