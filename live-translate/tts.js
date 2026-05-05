const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const OUTPUT_DIR = path.join(__dirname, 'output');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

let counter = 0;

// 🔥 CLEAN TEXT FUNCTION
function cleanSinhala(text) {
  return text
    .replace(/[A-Za-z]/g, '')     // remove English letters
    .replace(/[*#@\-_:]/g, '')    // remove symbols
    .replace(/\s+/g, ' ')         // clean extra spaces
    .trim();
}

async function synthesizeSinhala(text) {
  try {
    // 🔥 Clean before speaking
    const cleanText = cleanSinhala(text);

    if (!cleanText || cleanText.length < 3) {
      console.log("⚠️ Skipping invalid text");
      return;
    }

    const request = {
      input: { text: cleanText },
      voice: {
        languageCode: 'si-LK',
        ssmlGender: 'FEMALE'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 0.95,
        pitch: 0.0
      },
    };

    const [response] = await client.synthesizeSpeech(request);

    const fileName = path.join(
      OUTPUT_DIR,
      `audio_${String(counter++).padStart(4, '0')}.mp3`
    );

    fs.writeFileSync(fileName, response.audioContent, 'binary');

    console.log("🔊 Speaking:", cleanText);
    console.log("💾 Saved:", fileName);

    return fileName;

  } catch (err) {
    console.error("❌ TTS Error:", err.message);
  }
}

module.exports = synthesizeSinhala;