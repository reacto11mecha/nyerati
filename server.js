const socketIO = require("socket.io");
const express = require("express");
const robot = require("robotjs");
const next = require("next");
const path = require("path");
const http = require("http");
const fs = require("fs");
const os = require("os");

const { width: COMPwidth, height: COMPheight } = robot.getScreenSize();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const record = process.env.RECORD;
const recordFolder = path.join(__dirname, "record");
const recordPath = path.join(recordFolder, "coord.txt");
const app = next({ dev });
const handle = app.getRequestHandler();

switch (record) {
  case "record":
    fs.open(recordPath, "r", (err) => {
      if (err) {
        if (!fs.existsSync(recordFolder)) fs.mkdirSync(recordFolder);
        fs.writeFileSync(recordPath, "");
      }
    });
}

const moveMouse = (data) => {
  robot.moveMouse(data.x * COMPwidth, data.y * COMPheight);
  switch (record) {
    case "record":
      fs.appendFileSync(
        recordPath,
        `${JSON.stringify({ ...data, d: Date.now() })}${os.EOL}`
      );
  }
};

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
