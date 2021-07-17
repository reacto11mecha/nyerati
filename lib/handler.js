const chalk = require("chalk");
const { exec } = require("child_process");

const { port } = require("../config/constant");

const listen = require("../functions/consoleListen");

const redOllie = chalk.hex("#D1070A");

module.exports = (cwd) => {
  function childHandler(child) {
    child.stdout.on("data", (text) => {
      if (text.includes("Local")) listen();

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

      if (text.includes("Start building")) {
        console.log(
          `[${chalk.hex("#FDD798")("BUILD")}] Start building web interface`
        );
      }

      if (text.includes("\n[BUILD]")) {
        console.log(`[${chalk.green("BUILD")}] Success building web interface`);
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
