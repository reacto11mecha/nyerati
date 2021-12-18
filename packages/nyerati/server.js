const http = require("http");
const path = require("path");
const express = require("express");
const compression = require("compression");

const {
  config: {
    constant: { recordJson, port, dev },
  },
} = require("@nyerati/shared")(process);

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

  socket(user, moveMouse, server);
  udpSocket(user, moveMouse);

  server.listen(port, consoleListen);
}

processWriter(process);

// console.log(
//   require("path")
//
// );
