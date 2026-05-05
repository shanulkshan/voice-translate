const translate = require('./translate');

(async () => {
  try {
    const result = await translate("Good morning everyone, welcome to the program");
    console.log("🇱🇰 Sinhala:", result);
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  }
})();