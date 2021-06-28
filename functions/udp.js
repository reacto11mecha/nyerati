const dgram = require("dgram");
const chalk = require("chalk");

const UdpSoccConsole = () => `[${chalk.hex("#FDD798")("UDP")}]`;

const udp = (user, moveMouse, port) => {
  const udpSocket = dgram.createSocket({
    type: "udp4",
    reuseAddr: true,
  });

  udpSocket.on("message", (msg, sender) => {
    if (user.length === 1 && !user.includes(sender.address)) return;

    switch (msg.toString()) {
      case "init":
        if (user.length < 1 && !user.includes(sender.address)) {
          user.push(sender.address);
          console.log(`${UdpSoccConsole()} Init`);
          udpSocket.send("verified", sender.port, sender.address, (err) => {
            if (!err) {
              console.log(`${UdpSoccConsole()} Verified`);
            }
          });
        }
        break;
      case "ping":
        udpSocket.send("pong", sender.port, sender.address);
        break;
      case "close":
        if (user.length > 0 && user.includes(sender.address)) {
          const index = user.indexOf(sender.address);
          user.splice(index, 1);
          console.log(`${UdpSoccConsole()} Disconnected`);
        }
        break;
      default:
        void moveMouse(JSON.parse(msg.toString()));
    }
  });

  udpSocket.bind(port);
};

module.exports = udp;
