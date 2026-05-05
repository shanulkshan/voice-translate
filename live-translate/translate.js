require('dotenv').config();

const fetch = require('node-fetch');

// 🔐 Load API key securely
const API_KEY = process.env.GEMINI_API_KEY;

// 🔥 Gemini translation function
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
                  text: `Translate this into Sinhala (only output translation, no explanation): ${text}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await res.json();

    // 🔍 Debug (optional)
    console.log("RAW RESPONSE:", JSON.stringify(data, null, 2));

    // ✅ Extract translated text safely
    const translated =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!translated) {
      return "⚠️ No translation returned";
    }

    return translated.trim();

  } catch (err) {
    console.error("❌ Translate Error:", err.message);
    return "⚠️ Translation failed";
  }
}

module.exports = translate;