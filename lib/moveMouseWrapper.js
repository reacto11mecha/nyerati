const fs = require("fs");
const robot = require("robotjs");
const { fork } = require("child_process");

const { width: COMPwidth, height: COMPheight } = robot.getScreenSize();
const writer = fork("functions/writer");

const {
  isRecording,
  recordJson,
  recordFolder,
  recordText,
} = require("../config/constant");

const moveMouseWraper = () => {
  if (!isRecording)
    return (data) =>
      void robot.moveMouse(data.x * COMPwidth, data.y * COMPheight);

  fs.open(recordText, "r", (err) => {
    if (err) {
      if (!fs.existsSync(recordFolder)) fs.mkdirSync(recordFolder);
      fs.writeFileSync(recordText, "");
    }
  });

  return (data) => {
    robot.moveMouse(data.x * COMPwidth, data.y * COMPheight);
    writer.send({ ...data, d: Date.now() });
  };
};

module.exports = moveMouseWraper;
