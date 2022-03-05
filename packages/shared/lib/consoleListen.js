const qrcode = require("qrcode-terminal");
const ip = require("ip");

const getUSB = require("../utils/getUsbNWInterface");

// NETWORK IP
const usbNWIF = getUSB(); // USB Network Interface
const LAN_IP = ip.address() !== "127.0.0.1" ? ip.address() : null;
const USB_IP = ip.address(usbNWIF) !== "127.0.0.1" ? ip.address(usbNWIF) : null;

module.exports =
  ({ config }) =>
  async (isUDP) => {
    const boxen = await import("boxen").then((p) => p.default);
    const chalk = await import("chalk").then((p) => p.default);

    const port = config.constant.port;

    const hr = "_".repeat(process.stdout.columns / 2.5 - 8);
    const title = `${chalk.hex("#E5E0E2")("nye")}${chalk.cyan("rati")}`;
    const localListen = `${chalk.green(">")} Local: http://localhost:${port}`;
    const lanListen = `${chalk.green(">")} LAN: http://${LAN_IP}:${port}`;
    const usbListen = `${chalk.green(">")} USB : http://${USB_IP}:${port}`;

    const text = `
    ${title}
    ${chalk.hex("#465764")(hr)}

    ${localListen}
    ${LAN_IP ? lanListen : ""}
    ${USB_IP ? usbListen : ""}
  `;

    console.log(
      boxen(text, { padding: { right: 6.5 }, borderColor: "#D1070A" })
    );

    let qrcodeData = { port, connections: [] };

    if (LAN_IP) qrcodeData.connections.push({ type: "LAN", ip: LAN_IP });
    if (USB_IP) qrcodeData.connections.push({ type: "USB", ip: USB_IP });

    if (Object.keys(qrcodeData).length > 1)
      qrcode.generate(JSON.stringify(qrcodeData), { small: true });

    const logsTxt = `${chalk.hex("#4C7DBE")("L")} ${chalk.hex("#E7E7E7")(
      "O"
    )} ${chalk.hex("#E9C477")("G")} ${chalk.hex("#D7C8E7")("S")}`;
    const logsHr = chalk.hex("#363F50")("_".repeat("L O G S".length * 1.2));

    if (isUDP) {
      console.log(
        `${chalk.hex("#4C7DBE")(
          "INFO"
        )}: You are currently on udp mode, connect via pentab mobile app only!\n`
      );
    }

    const logs = `
  ${logsTxt}
  ${logsHr}
  `;

    console.log(logs);
  };
