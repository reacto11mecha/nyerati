#!/usr/bin/env node
const program = require("commander");
const packageData = require("./package.json");

const { run, record } = require("./lib/action")(__dirname);

program.version(packageData.version).name(Object.keys(packageData.bin)[0]);

program
  .command("run")
  .alias("r")
  .option("--udp-only", "Udp only connection")
  .description("Running a normal mode of nyerati")
  .action(run);

program
  .command("record")
  .alias("rec")
  .option("--udp-only", "Udp only connection")
  .description("Running a record mode of nyerati")
  .action(record);

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
