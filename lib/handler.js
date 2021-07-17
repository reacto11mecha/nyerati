const chalk = require("chalk");
const { exec } = require("child_process");

const { port } = require("../config/constant");

const consoleListen = require("../functions/consoleListen");
const listen = () => consoleListen(port);

const redOllie = chalk.hex("#D1070A");

module.exports = (cwd) => {
  function childHandler(child) {
    child.stdout.on("data", (text) => {
      if (text.includes("nyerati")) listen();
      if (text.includes("[Socket]")) {
        const event = text.split("[Socket]")[1].trim();

        console.log(`[${chalk.hex("#FDD798")("Socket")}] ${event}`);
      }
      if (text.includes("UDP")) {
        const event = text.split("[UDP]")[1].trim();

        console.log(`[${chalk.hex("#FDD798")("UDP")}] ${event}`);
      }
      if (text.includes("You are")) {
        console.log(
          `${chalk.hex("#4C7DBE")(
            "INFO"
          )}: You are currently on udp mode, connect via nyerati mobile app only!\n`
        );
      }
    });

    child.stderr.on("data", (text) => {
      if (text.includes("EADDRINUSE")) {
        console.log(
          `[${redOllie(
            "Error"
          )}] The port ${port} is already in use | EADDRINUSE`
        );
      }
    });
  }

  return { childHandler };
};
