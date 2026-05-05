const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const OUTPUT_DIR = path.join(__dirname, 'output');

// 🔥 track last played index
let lastPlayed = -1;

app.get('/stream', (req, res) => {
  console.log("🎧 Client connected");

  res.writeHead(200, {
    'Content-Type': 'audio/mpeg',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const interval = setInterval(() => {
    try {
      let files = fs.readdirSync(OUTPUT_DIR)
        .filter(f => f.endsWith('.mp3'));

      // 🔥 sort numerically (CRITICAL FIX)
      files.sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)[0]);
        const numB = parseInt(b.match(/\d+/)[0]);
        return numA - numB;
      });

      // 🔥 find next file AFTER last played
      const nextFile = files.find(f => {
        const num = parseInt(f.match(/\d+/)[0]);
        return num > lastPlayed;
      });

      if (nextFile) {
        const filePath = path.join(OUTPUT_DIR, nextFile);
        const num = parseInt(nextFile.match(/\d+/)[0]);

        console.log("▶ Playing:", nextFile);

        const data = fs.readFileSync(filePath);
        res.write(data);

        fs.unlinkSync(filePath);

        lastPlayed = num;
      } else {
        // keep alive
        res.write(Buffer.alloc(128));
      }

    } catch (err) {
      console.error("❌ Stream error:", err.message);
    }
  }, 100);

  req.on('close', () => {
    console.log("❌ Client disconnected");
    clearInterval(interval);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Stream running: http://localhost:${PORT}/stream`);
});