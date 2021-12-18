const path = require("path");

module.exports = function (process) {
  // Main config constant
  const port = parseInt(process.env.PORT, 10) || 3000;
  const dev = process.env.NODE_ENV !== "production";
  const mainDir = path.join(__dirname, "..");
  const webInterface = path.join(mainDir, "web-interface");

  //  Recording thing
  const isRecording = process.env.RECORD === "record";
  const recordFolder = path.join(mainDir, "record");
  const recordText = path.join(recordFolder, "coord.txt");
  const recordJson = path.join(recordFolder, "convert.json");

  return {
    dev,
    port,
    isRecording,
    recordFolder,
    webInterface,
    recordText,
    recordJson,
  };
};
