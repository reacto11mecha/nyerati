#!/usr/bin/env node
const program = require("commander");
const packageData = require("./package.json");

const handler = require("./lib/handler")(__dirname);

program.version(packageData.version).name(Object.keys(packageData.bin)[0]);

handler.then(({ run }) => {
  program
    .command("run")
    .alias("r")
    .option("--port <port>", "Change port to specific port")
    .description("UDP/datagram mode only")
    .action(run(packageData));

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
});
