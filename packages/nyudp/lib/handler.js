const { exec } = require("child_process");

const { consoleListen: listen } = require("@nyerati/shared")(process);

const childHandler = (redOllie, anyaHair, child, port) => {
  child.stdout.on("data", (text) => {
    if (text.includes("Local")) listen(true);

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
        `[${redOllie("Error")}] The port ${port} is already in use | EADDRINUSE`
      );
    } else {
      console.log(`[${redOllie("Error")}] ${text}`);
    }
  });
};

module.exports = async (cwd) => {
  const chalk = await import("chalk").then((p) => p.default);

  const redOllie = chalk.hex("#D1070A");
  const anyaHair = chalk.hex("#FDD798");

  const run = (packageData) => (option) => {
    if (option.port && isNaN(Number(option.port)))
      return console.log(`Port '${option.port}' is not a valid number!`);

    const PORT = !option.port ? null : option.port;

    const child = exec(packageData.scripts.start, {
      cwd,
      env: { ...process.env, PORT },
    });

    childHandler(redOllie, anyaHair, child, PORT);
  };

  return { run };
};
