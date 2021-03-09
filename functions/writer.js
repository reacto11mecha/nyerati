const path = require("path");
const os = require("os");
const fs = require("fs");

const recordFolder = path.join(__dirname, "..", "record");
const recordText = path.join(recordFolder, "coord.txt");

process.on(
  "message",
  (message) =>
    void fs.appendFileSync(recordText, `${JSON.stringify(message)}${os.EOL}`)
);
