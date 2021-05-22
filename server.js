const child_process = require("child_process");
const socketIO = require("socket.io");
const express = require("express");
const robot = require("robotjs");
const chalk = require("chalk");
const dgram = require("dgram");
const next = require("next");
const path = require("path");
const http = require("http");
const fs = require("fs");

const consoleListen = require("./functions/consoleListen");
const { width: COMPwidth, height: COMPheight } = robot.getScreenSize();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const isRecording = process.env.RECORD === "record";
const recordFolder = path.join(__dirname, "record");
const recordText = path.join(recordFolder, "coord.txt");
const recordJson = path.join(recordFolder, "convert.json");
const app = next({ dev });
const handle = app.getRequestHandler();
const writer = child_process.fork("./functions/writer");

let user = [];

const udpSocket = dgram.createSocket({
  type: "udp4",
  reuseAddr: true,
});

switch (isRecording) {
  case true:
    fs.open(recordText, "r", (err) => {
      if (err) {
        if (!fs.existsSync(recordFolder)) fs.mkdirSync(recordFolder);
        fs.writeFileSync(recordText, "");
      }
    });
}

const SoccConsole = () => `[${chalk.hex("#FDD798")("Socket")}]`;
const UdpSoccConsole = () => `[${chalk.hex("#FDD798")("UDP")}]`;

const moveMouse = (() => {
  if (!isRecording)
    return (data) =>
      void robot.moveMouse(data.x * COMPwidth, data.y * COMPheight);

  return (data) => {
    robot.moveMouse(data.x * COMPwidth, data.y * COMPheight);
    writer.send({ ...data, d: Date.now() });
  };
})();

udpSocket.on("message", (msg, sender) => {
  if (user.length === 1 && !user.includes(sender.address)) return;

  switch (msg.toString()) {
    case "init":
      user.push(sender.address);
      console.log(`${UdpSoccConsole()} Init`);
      udpSocket.send("verified", sender.port, sender.address, (err) => {
        if (!err) {
          console.log(`${UdpSoccConsole()} Verified`);
        }
      });
      break;
    case "ping":
      udpSocket.send("pong", sender.port, sender.address);
      break;
    case "close":
      if (user.length > 0 && user.includes(sender.address)) {
        const index = user.indexOf(sender.address);
        user.splice(index, 1);
        console.log(`${UdpSoccConsole()} Disconnected`);
      }
      break;
    default:
      void moveMouse(JSON.parse(msg.toString()));
  }
});

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

  udpSocket.bind(port);
});

const parseCoord = () => {
  if (isRecording)
    child_process.exec("node functions/parsecoord", {
      cwd: __dirname,
    });
  process.exit(1);
};

process.on("SIGINT", parseCoord);
process.on("disconnect", parseCoord);
