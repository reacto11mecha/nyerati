const path = require("path");

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

// Web Interface
const distRoot = path.join(mainDir, "dist");
const nodeModulesWI = path.join(webInterface, "node_modules"); // node modules web interface
const distWI = path.join(webInterface, "dist");

module.exports = {
  dev,
  port,
  distWI,
  distRoot,
  isRecording,
  recordFolder,
  webInterface,
  nodeModulesWI,
  recordText,
  recordJson,
};
