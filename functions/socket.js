const socketIO = require("socket.io");
const chalk = require("chalk");

const { dev, port } = require("../config/constant");

const SoccConsole = () => `[${chalk.hex("#FDD798")("Socket")}]`;
const mainConfig = {
  cors: ["http://localhost:3500/", "http://localhost:5000/"],
  methods: ["GET", "POST"],
};

module.exports = (user, moveMouse, server = null) => {
  const Sock = dev ? socketIO(mainConfig) : socketIO(server, mainConfig);

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

  if (dev) Sock.listen(port);
};
