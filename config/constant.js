const path = require("path");

const port = parseInt(process.env.PORT, 10) || 3000;

const isRecording = process.env.RECORD === "record";
const recordFolder = path.join(__dirname, "..", "record");
const recordText = path.join(recordFolder, "coord.txt");
const recordJson = path.join(recordFolder, "convert.json");

module.exports = {
  port,
  isRecording,
  recordFolder,
  recordText,
  recordJson,
};
