const udpSocket = require("@nyerati/nyudp");
const {
  consoleListen,
  config: {
    constant: { port },
  },
} = require("@nyerati/shared")(process);
const { processCoordWriter: processWriter } = require("./lib");

udpSocket().then((socket) => {
  socket.bind(port);

  consoleListen(true);
  processWriter(process);
});
