const createLogger = require('./createLogger');
const rabbitmqLogger = createLogger('rabbitmq');
module.exports = rabbitmqLogger;
