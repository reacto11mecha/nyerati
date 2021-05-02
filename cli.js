#!/usr/bin/env node
const program = require("commander");
const package = require("./package.json");
const { exec } = require("child_process");
const { join } = require("path");
const chalk = require("chalk");

const consoleListen = require("./functions/consoleListen");
const listen = () => consoleListen(parseInt(process.env.PORT, 10) || 3000);

program.version(package.version).name(Object.keys(package.bin)[0]);

const command = "node server.js";
const cwd = __dirname;

program
  .command("run")
  .alias("r")
  .description("Running a normal mode of pentab")
  .action(() => {
    const child = exec(command, {
      env: { ...process.env, NODE_ENV: "production" },
      cwd,
    });

    childHandler(child);
  });

program
  .command("record")
  .alias("rec")
  .description("Running a record mode of pentab")
  .action(() => {
    const child = exec(command, {
      env: { ...process.env, NODE_ENV: "production", RECORD: "record" },
      cwd,
    });

    childHandler(child);
  });

let buildAttempt = false;

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
        console.log(`[${chalk.green("Success")}] Success building next-pentab`);
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

const parsed = program.parse(process.argv);
if (
  !(
    parsed.args &&
    parsed.args.length > 0 &&
    typeof (parsed.args[0] === "object")
  )
) {
  program.help();
}
