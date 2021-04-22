const boxen = require("boxen");
const chalk = require("chalk");
const ip = require("ip");

const getUSB = require("../utils/getUsbNWInterface");

// NETWORK IP
const usbNWIF = getUSB(); // USB Network Interface
const LAN_IP = ip.address() !== "127.0.0.1" ? ip.address() : null;
const USB_IP = ip.address(usbNWIF) !== "127.0.0.1" ? ip.address(usbNWIF) : null;

module.exports = (port) => {
  const hr = "_".repeat(process.stdout.columns / 2.5 - 8);
  const title = `${chalk.hex("#E5E0E2")("next")}-${chalk.cyan("pentab")}`;
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

  console.log(boxen(text, { padding: { right: 6.5 }, borderColor: "#D1070A" }));
};
