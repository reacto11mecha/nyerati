const fs = require("fs");
const path = require("path");
const robot = require("robotjs");
const { fork } = require("child_process");

const { width: COMPwidth, height: COMPheight } = robot.getScreenSize();

const moveMouseWrapper = ({ config }, process) => () => {
  if (!config.constant.isRecording)
    return (data) =>
      void robot.moveMouse(data.x * COMPwidth, data.y * COMPheight);

  const recordText = config.constant.recordText;
  const writer = fork("writer", {
    cwd: path.join(__dirname, "../functions"),
    env: { ...process.env, recordText },
  });

  fs.open(recordText, "r", (err) => {
    if (err) {
      if (!fs.existsSync(config.constant.recordFolder))
        fs.mkdirSync(config.constant.recordFolder);
      fs.writeFileSync(config.constant.recordText, "");
    }
  });

  return (data) => {
    robot.moveMouse(data.x * COMPwidth, data.y * COMPheight);
    writer.send({ ...data, d: Date.now() });
  };
};

module.exports = moveMouseWrapper;
