const {
  config: {
    constant: { port },
  },
  consoleListen,
  updaterCheck,
} = require("@nyerati/shared")(process);

module.exports = async (pkg) => {
  const chalk = await import("chalk").then((p) => p.default);

  const redOllie = chalk.hex("#D1070A");
  const anyaHair = chalk.hex("#FDD798");

  function childHandler(child, isUDP) {
    child.stdout.on("data", (text) => {
      if (text.includes("Local")) {
        consoleListen(isUDP);

        updaterCheck(pkg);
      }

      if (text.includes("[Socket]")) {
        const event = text.split("[Socket]")[1].trim();

        console.log(`[${anyaHair("Socket")}] ${event}`);
      }

      if (text.includes("UDP")) {
        const event = text.split("[UDP]")[1].trim();

        console.log(`[${anyaHair("UDP")}] ${event}`);
      }
    });

    child.stderr.on("data", (text) => {
      if (text.includes("EADDRINUSE")) {
        console.log(
          `[${redOllie(
            "Error"
          )}] The port ${port} is already in use | EADDRINUSE`
        );
      } else {
        console.log(`[${redOllie("Error")}] ${text}`);
      }
    });
  }

  return { childHandler };
};
