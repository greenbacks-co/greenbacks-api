import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ level, message, timestamp }) =>
        `[${timestamp}] [${level.toUpperCase()}] ${
          message instanceof Object ? JSON.stringify(message, null, 2) : message
        }`
    ),
    format.colorize({ all: true })
  ),
  level: 'info',
  transports: [new transports.Console()],
});

export default logger;
