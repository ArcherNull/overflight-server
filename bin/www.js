/*
 * @Author: Null
 * @Date: 2022-10-22 17:56:07
 * @Description:
 */
const app = require("../app");
const http = require("http");
var debug = require("debug")("express-server:server");

const { PORT } = require("../config");

const server = http.createServer(app);
const port = normalizePort(PORT);
app.set("port", port);

server.listen(port, (req, res) => {
  console.log(`express server running at http://localhost:${PORT}`);
});

server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  console.log("错误", error);
}
function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
