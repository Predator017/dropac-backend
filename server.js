require('dotenv').config();
const express = require('express');
const app = require('./src/app');
const serverLogger = require('./src/utils/logger/serverLogger');
const PORT = process.env.PORT || 5000;
const path = require('path');


const server = app.listen(PORT, () => {
  console.log('server', `🚀 Server started on port ${PORT}`);
  serverLogger.info(`🚀 Server started on port ${PORT}`);
});

app.use(express.static(path.join(__dirname, 'public')));

// Route for privacy.pdf
app.get('/privacy-policy.pdf', (req, res) => {
  res.contentType('application/pdf');  // Set content type to PDF
  res.setHeader('Content-Disposition', 'inline; filename="privacy-policy.pdf"');  // Inline display in browser
  res.sendFile(path.join(__dirname, 'public', 'privacy-policy.pdf'));
});

// Route for term.pdf
app.get('/terms-conditions.pdf', (req, res) => {  
  res.contentType('application/pdf');  // Set content type to PDF
  res.setHeader('Content-Disposition', 'inline; filename="terms-conditions.pdf"');  // Inline display in browser
  res.sendFile(path.join(__dirname, 'public', 'terms-conditions.pdf'));
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
