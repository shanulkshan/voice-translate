const speechToText = require('./stt');
const translate = require('./translate');
const tts = require('./tts');

(async () => {
  const text = await speechToText('./chunks/chunk_000.wav');
  console.log("EN:", text);

  const sinhala = await translate(text);
  console.log("SI:", sinhala);

  await tts(sinhala);
})();