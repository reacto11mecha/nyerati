const child_process = require("child_process");
const socketIO = require("socket.io");
const express = require("express");
const robot = require("robotjs");
const boxen = require("boxen");
const chalk = require("chalk");
const next = require("next");
const path = require("path");
const http = require("http");
const fs = require("fs");

const { width: COMPwidth, height: COMPheight } = robot.getScreenSize();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const record = process.env.RECORD;
const recordFolder = path.join(__dirname, "record");
const recordText = path.join(recordFolder, "coord.txt");
const recordJson = path.join(recordFolder, "convert.json");
const app = next({ dev });
const handle = app.getRequestHandler();
const writer = child_process.fork("./functions/writer");

switch (record) {
  case "record":
    fs.open(recordText, "r", (err) => {
      if (err) {
        if (!fs.existsSync(recordFolder)) fs.mkdirSync(recordFolder);
        fs.writeFileSync(recordText, "");
      }
    });
}

const moveMouse = (() => {
  if (record !== "record")
    return (data) =>
      void robot.moveMouse(data.x * COMPwidth, data.y * COMPheight);

  return (data) => {
    robot.moveMouse(data.x * COMPwidth, data.y * COMPheight);
    writer.send({ ...data, d: Date.now() });
  };
})();

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
    const hr = "_".repeat(process.stdout.columns / 2.5 - 8);
    const title = `${chalk.hex("#E5E0E2")("next")}-${chalk.cyan("pentab")}`;
    const localListen = `${chalk.green(">")} Local: http://localhost:${port}`;

    const text = `
      ${title}
      ${chalk.hex("#465764")(hr)}

      ${localListen}
    `;

    console.log(
      boxen(text, { padding: { right: 6.5 }, borderColor: "#D1070A" })
    );
  });

  const Sock = socketIO(server);

  Sock.on("connection", (socc) => {
    console.log("SOCKET CONNECTED");

    socc.on("touch", moveMouse);

    socc.on("check:ping", () => socc.emit("check:pong"));
  });
});
