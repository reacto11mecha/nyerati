const http = require("http");
const path = require("path");
const express = require("express");

const { recordJson, port, dev, distRoot } = require("./config/constant");

const {
  consoleListen,
  udp: udpSocket,
  socket,
  checkBuild,
} = require("./functions");
const {
  processCoordWriter: processWriter,
  moveMouseWrapper,
} = require("./lib");

let user = [];

const moveMouse = moveMouseWrapper();

if (dev) {
  socket(user, moveMouse);
  udpSocket(user, moveMouse);

  consoleListen();
} else {
  prodServer();
}

async function prodServer() {
  await checkBuild();

  const app = express();

  app.use(express.static(distRoot));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(distRoot, "index.html"));
  });

  const server = http.createServer(app);

  socket(user, moveMouse, server);
  udpSocket(user, moveMouse);

  server.listen(port, consoleListen);
}

processWriter(process);
