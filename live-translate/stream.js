const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

if (!fs.existsSync('chunks')) {
  fs.mkdirSync('chunks');
}

function startStream(url) {
  ffmpeg(url)
    .audioCodec('pcm_s16le')
    .audioFrequency(16000)
    .audioChannels(1)
    .format('segment')
    .outputOptions([
      '-segment_time 5', // 🔥 smoother chunks
      '-reset_timestamps 1'
    ])
    .output('chunks/chunk_%03d.wav')
    .on('start', () => console.log('🎧 Stream started'))
    .on('error', err => console.error('❌ Error:', err.message))
    .on('end', () => console.log('Stream ended'))
    .run();
}

// 🔴 PUT YOUR STREAM URL
startStream("http://as-hls-ww-live.akamaized.net/pool_87948813/live/ww/bbc_world_service/bbc_world_service.isml/bbc_world_service-audio%3d96000.norewind.m3u8");