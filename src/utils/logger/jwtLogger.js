const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const fs = require('fs');
const path = require('path');

// Create logs/jwt directory if not exists
const logDir = path.join(__dirname, '../../../', 'logs', 'jwtlogs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Custom log format
const logFormat = printf(({ timestamp, message }) => {
  return `[${timestamp}] ${message}`;
});

// Get monthly log file
const getMonthlyLogFilename = () => {
  const now = new Date();
  const month = now.getMonth() + 1; // 0-indexed
  const year = now.getFullYear();
  return path.join(logDir, `${year}-${String(month).padStart(2, '0')}.log`);
};

const jwtLogger = createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.File({
      filename: getMonthlyLogFilename(),
      level: 'info',
    })
  ]
});

module.exports = jwtLogger;
