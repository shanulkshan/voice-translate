const fs = require('fs');
const path = require('path');

const speechToText = require('./stt');
const translate = require('./translate');
const tts = require('./tts');

const CHUNK_DIR = './chunks';

const PROCESSED = new Set();
let isProcessing = false;

// 🔥 NEW: sentence buffer
let buffer = "";

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

    PROCESSED.add(file);

    console.log(`📥 Processing: ${file}`);

    const text = await speechToText(filePath);

    if (!text || text.trim().length < 3) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      isProcessing = false;
      return;
    }

    console.log("📝 EN:", text);

    // 🔥 ADD TO BUFFER
    buffer += " " + text;

    // 🔥 Only process when sentence is ready
    if (
      text.endsWith('.') ||
      text.endsWith('?') ||
      text.endsWith('!') ||
      buffer.length > 80
    ) {
      console.log("🧠 Processing sentence:", buffer);

      const sinhala = await translate(buffer);

      if (!sinhala || sinhala.includes("⚠️")) {
        console.log("⚠️ Translation failed");
      } else {
        console.log("🌐 SI:", sinhala);
        await tts(sinhala);
      }

      buffer = ""; // reset
    }

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await sleep(500);

  } catch (err) {
    console.error("❌ Error:", err.message);
  }

  isProcessing = false;
}

setInterval(processChunks, 1000);