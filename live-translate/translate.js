const fetch = require('node-fetch');

const API_KEY = "AIzaSyA6rV8uISOJLUmKsGzwiqUxU7zdipNM55k";

async function translate(text) {
  const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Translate the following English sentence into clear spoken Sinhala. Only return Sinhala text:\n${text}`
              }
            ]
          }
        ]
      })
    }
  );

  const data = await res.json();

  console.log("RAW RESPONSE:", JSON.stringify(data, null, 2));

  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No translation returned";
}

module.exports = translate;