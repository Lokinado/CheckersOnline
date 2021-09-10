const { createLogger, format, transports, addColors } = require('winston');
const { combine, timestamp, label, printf } = format;

const myCustomLevels = {
  levels: {
    cmd: -2,
    db: -1,
    req: 0,
    res: 1,
    info: 2,
    warn: 3,
    error: 4, 
  },
  colors: {
    cmd: 'white',
    db: 'gray',
    req: 'brightBlue',
    res: 'blue',
    info: 'green',
    warn: 'yellow',
    error: 'red',
  }
};

const custom = format.printf((info) => {
  return `${info.level} ${info.message}`;
});
  
const logger = createLogger({
  levels: myCustomLevels.levels,
  level: 'error',
  format: format.combine(
    format(info => {
      info.level = "[" + info.level.toUpperCase() + "]";
      return info;
    })(),
    format.colorize(),
    custom,
  ),
  transports: [new transports.Console()],
});

addColors(myCustomLevels.colors);

export {
  logger as log,
  logRequest,
};

function logRequest() {
  return (req, res, next) => {
    let info;
    if (req.isAuthenticated()) {
      info = "(" + req.user.username + ")";
    } else {
      info = "()"
    }
    info += " --> ";
    info += req.originalUrl;

    logger.req(info);
    next();
  }
}