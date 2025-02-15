import pino from "pino";

let logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
      ignore: "pid,hostname",
      sync: false,
      append: true,
      mkdir: true,
    },
  },
});

module.exports = logger;

export default logger;
