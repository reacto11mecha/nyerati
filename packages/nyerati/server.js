const {
  config: {
    constant: { dev, port },
  },
  consoleListen,
  lib,
} = require("@nyerati/shared")(process);

const start = async () => {
  const app = require("./app");

  try {
    await app.listen(port, "0.0.0.0");
    consoleListen();
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

if (dev) {
  const socketIO = require("socket.io");
  const connectivity = require("./plugin/connectivity");

  let user = [];
  const mouseMover = lib.moveMouse();

  (async () =>
    await Promise.all([
      connectivity.controller(user, mouseMover), // Socket io
      connectivity.udpSocket(user, mouseMover), // UDP
    ]).then(([socketOnConnection, udp]) => {
      const Sock = socketIO(connectivity.mainConfig);
      Sock.on("connection", socketOnConnection);

      udp.bind(port);
      Sock.listen(port);

      consoleListen();
    }))();
} else {
  start();
}
