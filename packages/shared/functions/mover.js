const robot = require("robotjs");

const { width: COMPwidth, height: COMPheight } = robot.getScreenSize();

process.on(
  "message",
  ({ x, y }) => void robot.moveMouse(x * COMPwidth, y * COMPheight)
);
