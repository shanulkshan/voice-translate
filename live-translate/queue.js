let audioQueue = [];

function addToQueue(file) {
  audioQueue.push(file);
  console.log("📥 Added to queue:", file);
}

function getNext() {
  return audioQueue.shift();
}

function hasItems() {
  return audioQueue.length > 0;
}

module.exports = {
  addToQueue,
  getNext,
  hasItems
};