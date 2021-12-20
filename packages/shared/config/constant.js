const path = require("path");
const os = require("os");

module.exports = function (process) {
  // Main config constant
  const port = parseInt(process.env.PORT, 10) || 3000;
  const dev = process.env.NODE_ENV !== "production";
  const mainDir = path.join(os.homedir(), ".nyerati"); // HOME_DIR/.nyerati

  //  Recording thing
  const isRecording = process.env.RECORD === "record";
  const recordFolder = path.join(mainDir, "record");
  const recordText = path.join(recordFolder, "coord.txt");
  const recordJson = () => {
    const date = new Date();

    // yyyy-dd-m_HH-MM-ss
    const filename = `${date.getFullYear()}-${date.getDate()}-${date.getMonth()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.json`;

    return path.join(recordFolder, filename);
  };

  return {
    dev,
    port,
    mainDir,
    isRecording,
    recordFolder,
    recordText,
    recordJson,
  };
};
