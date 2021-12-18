const {
  config: {
    constant: { port },
  },
  consoleListen,
} = require("@nyerati/shared")(process);

module.exports = async () => {
  const chalk = await import("chalk").then((p) => p.default);

  const redOllie = chalk.hex("#D1070A");
  const anyaHair = chalk.hex("#FDD798");

  function childHandler(child) {
    child.stdout.on("data", (text) => {
      if (text.includes("Local")) consoleListen();

      if (text.includes("[Socket]")) {
        const event = text.split("[Socket]")[1].trim();

        console.log(`[${anyaHair("Socket")}] ${event}`);
      }

      if (text.includes("UDP")) {
        const event = text.split("[UDP]")[1].trim();

        console.log(`[${anyaHair("UDP")}] ${event}`);
      }

      if (text.includes("You are")) {
        console.log(
          `${chalk.hex("#4C7DBE")(
            "INFO"
          )}: You are currently on udp mode, connect via nyerati mobile app only!\n`
        );
      }

      if (text.includes("Start building")) {
        console.log(`[${anyaHair("BUILD")}] Start building web interface`);
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
