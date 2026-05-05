require('dotenv').config();
const fetch = require('node-fetch');

const API_KEY = process.env.GEMINI_API_KEY;

async function translate(text) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Translate the following into Sinhala.

STRICT RULES:
- Output ONLY Sinhala text
- NO English
- NO explanations
- NO formatting
- NO symbols like *, #, -, :
- Just one clean Sinhala sentence

Text: ${text}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await res.json();

    let translated =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!translated) return "⚠️";

    // 🔥 CLEAN EXTRA SYMBOLS (backup safety)
    translated = translated
      .replace(/[*#\-_:]/g, '') // remove symbols
      .replace(/[A-Za-z]/g, '') // remove English letters
      .trim();

    return translated;

  } catch (err) {
    console.error("❌ Translate Error:", err.message);
    return "⚠️";
  }
}

module.exports = translate;