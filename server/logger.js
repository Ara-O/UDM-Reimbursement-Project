import winston from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    errors({ stack: true }),
    colorize({ all: true }),
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    printf(
      (info) =>
        `[${info.timestamp}] [API: ${info.api}] ${info.level}: ${info.message}`
    )
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
