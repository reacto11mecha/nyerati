#!/usr/bin/env node
const program = require("commander");
const package = require("./package.json");

const { run, record } = require("./lib/action")(__dirname);

program.version(package.version).name(Object.keys(package.bin)[0]);

program
  .command("run")
  .alias("r")
  .description("Running a normal mode of pentab")
  .action(() => run());

program
  .command("record")
  .alias("rec")
  .description("Running a record mode of pentab")
  .action(() => record());

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
