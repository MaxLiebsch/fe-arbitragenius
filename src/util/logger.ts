import { createLogger, format, transports } from 'winston'
const { combine, timestamp, printf, colorize } = format;
const path = require('path');

// Define custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: combine(
        colorize(),
        logFormat
      )
    }),
    new transports.File({ filename: path.join('/var/log', 'app.log') }) // Save logs to /var/log/app.log
  ],
});

export default logger;