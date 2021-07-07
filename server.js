const socketIO = require("socket.io");
const chalk = require("chalk");
const fs = require("fs");

const { recordJson, port } = require("./config/constant");

const { consoleListen, udp: udpSocket } = require("./functions");
const {
  processCoordWriter: processWriter,
  moveMouseWrapper,
} = require("./lib");

let user = [];

const moveMouse = moveMouseWrapper();

const SoccConsole = () => `[${chalk.hex("#FDD798")("Socket")}]`;

const Sock = socketIO(server);

Sock.on("connection", (socc) => {
  if (user.length === 1 && !user.includes(socc.id)) {
    socc.disconnect();
    return;
  }

  user.push(socc.id);
  console.log(`${SoccConsole()} Connected`);

  socc.on("touch", moveMouse);

  socc.on("check:ping", () => socc.emit("check:pong"));

  socc.on("disconnect", () => {
    if (user.length > 0 && user.includes(socc.id)) {
      const index = user.indexOf(socc.id);
      user.splice(index, 1);
      console.log(`${SoccConsole()} Disconnected`);
    }
  });
});

Sock.listen(port);
udpSocket(user, moveMouse, port);
consoleListen(port);

processWriter(process);
