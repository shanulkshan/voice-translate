const speechToText = require('./stt');

(async () => {
  try {
    const text = await speechToText('./chunks/chunk_016.wav');
    console.log("📝 TEXT:", text);
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  }
})();