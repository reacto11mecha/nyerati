const socketIO = require("socket.io");
const express = require("express");
const chalk = require("chalk");
const next = require("next");
const http = require("http");
const fs = require("fs");

const { recordJson, port } = require("./config/constant");

const { consoleListen, udp: udpSocket } = require("./functions");
const {
  processCoordWriter: processWriter,
  moveMouseWrapper,
} = require("./lib");

const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

let user = [];

const moveMouse = moveMouseWrapper();

const SoccConsole = () => `[${chalk.hex("#FDD798")("Socket")}]`;

app.prepare().then(() => {
  const exApp = express();

  exApp.get("/api/coord", (req, res) => {
    if (!fs.existsSync(recordJson)) {
      res.status(200).json({ error: "Recorded file not found" });
    } else {
      const Dat = require(recordJson);
      const data = Dat.map((dat, idx) => ({
        ...dat,
        diff: idx == 0 ? 0 : dat.d - Dat[idx - 1].d,
      }));
      res.status(200).json(data);
    }
  });

  exApp.all("*", (req, res) => {
    return handle(req, res);
  });

  const server = http.createServer(exApp);

  server.listen(port, (err) => {
    if (err) throw err;
    consoleListen(port);
  });

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

  udpSocket(user, moveMouse, port);
});

processWriter(process);
