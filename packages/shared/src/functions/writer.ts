import os from "os";
import fs from "fs";

process.on("message", (message): void =>
  fs.appendFileSync(
    process.env.recordText,
    `${JSON.stringify(message)}${os.EOL}`
  )
);
