import winston, { format, transports } from "winston";
import "winston-daily-rotate-file";

// Define log format
const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }), // Ensures stack traces are captured
  format.printf((info) => {
    // Handle logging with stack trace for error levels
    if (info.stack) {
      return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message} -- ${info.stack}`;
    }
    // Default log message format
    return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`;
  }),
);
// Create a logger instance
const logger = winston.createLogger({
  level: "info", // Default log level
  format: logFormat,
  transports: [
    new transports.Console({
      format: logFormat,
    }), // Console logging
    // TODO: Understand this eslint error, no need for files now anyways
    // new transports.DailyRotateFile({
    //   filename: "logs/application-%DATE%.log",
    //   datePattern: "YYYY-MM-DD",
    //   maxFiles: "14d", // Keep logs for 14 days
    // }),
  ],
});

export default logger;
