const {
  config: {
    constant: { port },
  },
  lib,
} = require("@nyerati/shared")(process);

const fp = require("fastify-plugin");
const udpSocket = require("@nyerati/nyudp");

const mainConfig = {
  cors: ["http://localhost:3500/", "http://localhost:5000/"],
  methods: ["GET", "POST"],
};

const _controller = async (user, moveMouse) => {
  const chalk = await import("chalk").then((p) => p.default);

  const SoccConsole = () => `[${chalk.hex("#FDD798")("Socket")}]`;

  return (socc) => {
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
  };
};

const plugin = fp(async (fastify) => {
  let user = [];
  const mouseMover = lib.moveMouse();

  const controller = await _controller(user, mouseMover);
  const udp = await udpSocket(user, mouseMover);

  fastify.register(require("fastify-socket.io"), mainConfig).after(() => {
    fastify.io.on("connection", controller);
    udp.bind(port);
  });
});

// hacky way
module.exports = new Proxy(plugin, {
  get: function (target, prop) {
    if (prop === "controller") return _controller;
    else if (prop === "mainConfig") return mainConfig;
    else if (prop === "udpSocket") return udpSocket;
    else return Reflect.get(...arguments);
  },
});
