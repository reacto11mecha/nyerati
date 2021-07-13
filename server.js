const fs = require("fs");
const http = require("http");
const express = require("express");

const { recordJson, port, dev } = require("./config/constant");

const { consoleListen, udp: udpSocket, socket } = require("./functions");
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
  const app = express();
  const server = http.createServer(app);

  socket(user, moveMouse, server);
  udpSocket(user, moveMouse);

  server.listen(port, consoleListen);
}

processWriter(process);
