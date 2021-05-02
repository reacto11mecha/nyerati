const chalk = require("chalk");
const { exec } = require("child_process");

const port = parseInt(process.env.PORT, 10) || 3000;

const consoleListen = require("../functions/consoleListen");
const listen = () => consoleListen(port);

const redOllie = chalk.hex("#D1070A");

let buildAttempt = false;

module.exports = (cwd) => {
  function build(errorMessage = false) {
    if (!buildAttempt) {
      buildAttempt = true;
      if (errorMessage)
        console.log(
          `[${redOllie(
            "Error"
          )}] Could not find a production build, in an attempt to build it.....`
        );

      const child = exec("npm run build", {
        cwd,
      });

      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);

      child.on("exit", (code) => {
        if (code === 0) {
          console.log(
            `[${chalk.green("Success")}] Success building next-pentab`
          );
        }
      });
    }
  }

  function childHandler(child) {
    child.stdout.on("data", (text) => {
      if (text.includes("next-pentab")) listen();
      if (text.includes("[Socket]")) {
        const event = text.split("[Socket]")[1].trim();

        console.log(`[${chalk.hex("#FDD798")("Socket")}] ${event}`);
      }
    });

    child.stderr.on("data", (text) => {
      if (text.includes("Could not find a production build")) build(true);
      if (text.includes("EADDRINUSE")) {
        console.log(
          `[${redOllie(
            "Error"
          )}] The port ${port} is already in use | EADDRINUSE`
        );
      }
    });
  }

  return { childHandler, build };
};
