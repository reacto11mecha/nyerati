const socketIO = require("socket.io");
const express = require("express");
const robot = require("robotjs");
const next = require("next");
const http = require("http");

const { width: COMPwidth, height: COMPheight } = robot.getScreenSize();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const moveMouse = (data) =>
  robot.moveMouse(data.x * COMPwidth, data.y * COMPheight);

app.prepare().then(() => {
  const exApp = express();

  exApp.all("*", (req, res) => {
    return handle(req, res);
  });

  const server = http.createServer(exApp);

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });

  const Sock = socketIO(server);

  Sock.on("connection", (socc) => {
    console.log("SOCKET CONNECTED");

    socc.on("touch", moveMouse);

    socc.on("check:ping", () => socc.emit("check:pong"));
  });
});
