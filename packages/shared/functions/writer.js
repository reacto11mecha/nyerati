const os = require("os");
const fs = require("fs");

process.on(
  "message",
  (message) =>
    void fs.appendFileSync(
      process.env.recordText,
      `${JSON.stringify(message)}${os.EOL}`
    )
);
