const fs = require('fs');
const path = require('path');

const speechToText = require('./stt');
const translate = require('./translate');
const tts = require('./tts');

const CHUNK_DIR = './chunks';

// prevent duplicates
const PROCESSED = new Set();

// prevent overlapping execution
let isProcessing = false;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processChunks() {
  if (isProcessing) return;
  isProcessing = true;

  try {
    let files = fs.readdirSync(CHUNK_DIR);

    if (files.length === 0) {
      isProcessing = false;
      return;
    }

    files.sort();

    const file = files[0];
    const filePath = path.join(CHUNK_DIR, file);

    if (PROCESSED.has(file)) {
      isProcessing = false;
      return;
    }

    // mark immediately
    PROCESSED.add(file);

    console.log(`📥 Processing: ${file}`);

    const text = await speechToText(filePath);

    // 🔥 skip only real empty audio
    if (!text || text.trim().length < 3) {
      console.log("⚠️ Empty audio skipped");
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      isProcessing = false;
      return;
    }

    console.log("📝 EN:", text);

    const sinhala = await translate(text);

    if (!sinhala || sinhala.includes("⚠️")) {
      console.log("⚠️ Translation failed");
      isProcessing = false;
      return;
    }

    console.log("🌐 SI:", sinhala);

    await tts(sinhala);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 🔥 minimal delay (almost real-time)
    await sleep(500);

  } catch (err) {
    console.error("❌ Error:", err.message);
  }

  isProcessing = false;
}

setInterval(processChunks, 1000);