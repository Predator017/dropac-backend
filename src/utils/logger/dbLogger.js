const createLogger = require('./createLogger');
const dbLogger = createLogger('db');
module.exports = dbLogger;
