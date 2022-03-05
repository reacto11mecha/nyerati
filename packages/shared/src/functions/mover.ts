import robot from "robotjs";

export interface message {
  x: number;
  y: number;
}

const { width: COMPwidth, height: COMPheight } = robot.getScreenSize();

process.on("message", ({ x, y }: message): void =>
  robot.moveMouse(x * COMPwidth, y * COMPheight)
);
