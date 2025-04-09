require('dotenv').config();
const app = require('./src/app');
const serverLogger = require('./src/utils/logger/serverLogger');
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('server', `🚀 Server started on port ${PORT}`);
  serverLogger.info(`🚀 Server started on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('server', `❌ Uncaught Exception: ${err.stack || err}`);
  serverLogger.error(`Uncaught Exception: ${err.stack || err.message}`);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('server', `❌ Unhandled Rejection: ${err.stack || err}`);
  serverLogger.error(`Uncaught Exception: ${err.stack || err.message}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('server', '📴 SIGTERM received. Shutting down gracefully...');
  serverLogger.info('📴 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('server', '💤 Server closed');
    serverLogger.info('💤 Server closed');
  });
});
