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

  if (!fs.existsSync(config.constant.mainDir))
    fs.mkdirSync(config.constant.mainDir);

  if (!fs.existsSync(recordText)) {
    if (!fs.existsSync(config.constant.recordFolder))
      fs.mkdirSync(config.constant.recordFolder);
    fs.writeFileSync(recordText, "");
  }

  return (data) => {
    robot.moveMouse(data.x * COMPwidth, data.y * COMPheight);
    writer.send({ ...data, d: Date.now() });
  };
};

module.exports = moveMouseWrapper;
