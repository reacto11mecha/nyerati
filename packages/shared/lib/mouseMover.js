const fs = require("fs");
const path = require("path");
const { fork } = require("child_process");

const moveMouseWrapper =
  ({ config }, process) =>
  () => {
    const mover = fork("mover", {
      cwd: path.join(__dirname, "../functions"),
    });

    if (!config.constant.isRecording) return (data) => mover.send(data);

    const recordText = config.constant.recordText;
    const writer = fork("writer", {
      cwd: path.join(__dirname, "../functions"),
      env: { ...process.env, recordText },
    });

    if (!fs.existsSync(config.constant.mainDir))
      fs.mkdirSync(config.constant.mainDir);

    if (!fs.existsSync(recordText)) {
      if (!fs.existsSync(config.constant.recordFolder))
        fs.mkdirSync(config.constant.recordFolder);
      fs.writeFileSync(recordText, "");
    }

    return (data) => {
      mover.send(data);
      writer.send({ ...data, d: Date.now() });
    };
  };

module.exports = moveMouseWrapper;
