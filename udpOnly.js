const chalk = require("chalk");
const { port } = require("./config/constant");

const { consoleListen, udp: udpSocket } = require("./functions");
const {
  processCoordWriter: processWriter,
  moveMouseWrapper,
} = require("./lib");

let user = [];

const moveMouse = moveMouseWrapper();

udpSocket(user, moveMouse);

console.log(
  `${chalk.hex("#4C7DBE")(
    "INFO"
  )}: You are currently on udp mode, connect via pentab mobile app only!\n`
);

consoleListen();
processWriter(process);
