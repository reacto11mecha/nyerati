const http = require("http");
const path = require("path");
const express = require("express");
const compression = require("compression");

const {
  config: {
    constant: { port, dev },
  },
  lib,
  consoleListen,
} = require("@nyerati/shared")(process);
const udpSocket = require("@nyerati/nyudp");

const { socket } = require("./functions");
const { processCoordWriter: processWriter } = require("./lib");

let user = [];

const moveMouse = lib.moveMouse();

if (dev) {
  socket(user, moveMouse);
  udpSocket(user, moveMouse).then((socket) => {
    socket.bind(port);

    consoleListen();
  });
} else {
  prodServer();
}

function prodServer() {
  const distRoot = path
    .dirname(require.resolve("@nyerati/web-interface"))
    .replace("src", "dist");

  const app = express();

  app.use(compression());

  app.use(express.static(distRoot));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(distRoot, "index.html"));
  });

  const server = http.createServer(app);

  udpSocket(user, moveMouse).then((socketUDP) => {
    socketUDP.bind(port);

    socket(user, moveMouse, server);
    server.listen(port, consoleListen);
  });
}

processWriter(process);
