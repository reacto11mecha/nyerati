const chalk = require("chalk");
const { exec } = require("child_process");

const consoleListen = require("../functions/consoleListen");
const listen = () => consoleListen(parseInt(process.env.PORT, 10) || 3000);

let buildAttempt = false;

module.exports = (cwd) => {
  function build() {
    if (!buildAttempt) {
      buildAttempt = true;
      console.log(
        `[${chalk.hex("#D1070A")(
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
      if (text.includes("Could not find a production build")) {
        build();
      }
    });
  }

  return { build, childHandler };
};
