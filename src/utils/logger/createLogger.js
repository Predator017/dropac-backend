// utils/logger/createLogger.js
const fs = require('fs');
const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');

const createLogger = (logFolderPath) => {
  // Ensure log folder exists
  const fullPath = path.join(__dirname, '../../../logs', logFolderPath);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

  const transport = new winston.transports.DailyRotateFile({
    dirname: fullPath,
    filename: '%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxFiles: '14d',
    level: 'info',
  });

  return winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(
        ({ timestamp, level, message }) => `[${timestamp}] [${level}] ${message}`
      )
    ),
    transports: [transport],
  });
};

module.exports = createLogger;
