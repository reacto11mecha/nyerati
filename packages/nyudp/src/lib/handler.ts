import { ChildProcess, exec } from "child_process";
import shared from "@nyerati/shared";
import { ChalkInstance } from "chalk";
import { packageInterface } from "@nyerati/shared/dist/utils/updaterCheck";

const { consoleListen: listen, updaterCheck } = shared(process);

const childHandler = (
  redOllie: ChalkInstance,
  anyaHair: ChalkInstance,
  child: ChildProcess,
  pkg: packageInterface,
  port
) => {
  child.stdout.on("data", (text: string) => {
    if (text.includes("Local")) {
      listen(true);

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

  child.stderr.on("data", (text: string | string[]) => {
    if (text.includes("EADDRINUSE")) {
      console.log(
        `[${redOllie("Error")}] The port ${port} is already in use | EADDRINUSE`
      );
    } else {
      console.log(`[${redOllie("Error")}] ${text}`);
    }
  });
};

export default async function handler(cwd: string, pkg: any) {
  const chalk = await import("chalk").then((p) => p.default);

  const redOllie = chalk.hex("#D1070A");
  const anyaHair = chalk.hex("#FDD798");

  const run =
    (packageData: { scripts: { start: string } }) =>
    (option: { port: any }) => {
      if (option.port && isNaN(Number(option.port)))
        return console.log(`Port '${option.port}' is not a valid number!`);

      const PORT = !option.port ? null : option.port;

      const child = exec(packageData.scripts.start, {
        cwd,
        env: { ...process.env, PORT },
      });

      childHandler(redOllie, anyaHair, child, pkg, PORT);
    };

  return { run };
}
