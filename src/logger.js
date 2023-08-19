// Logger. (Can be re-generated.)
const {
    createLogger,
    format,
    transports
  } = require('winston');
  
  var moment = require('moment');
  
  const config = require('config');
  // !code: imports // !end
  // !code: init // !end
  
  // Configure the Winston logger. For the complete documentation seee https://github.com/winstonjs/winston
  const logger = createLogger({
    // !<DEFAULT> code: level
    // To see more detailed errors, change this to debug'
    level: config.loggerLevel,
    // !end
    // !code: format
    format: format.combine(
      format.splat(),
      format.simple(),
      format.json()
    ),
    // !end
    // !<DEFAULT> code: transport
    transports: [
      new transports.Console()
    ],
    // !end
    // !code: moduleExports // !end
  });
  
  function applog(level, interval, ...data) {
  
    // Get NOW date time
    var date = new Date();
    const current = moment().format('YYYY-MM-DDTHH:mm:ssZ');
  
    // Get elapsed time in milliseconds
    var elapsedTime = (date - interval) / 1000;
  
    // Configure application logger
    return logger.log({
      'level': level,
      'ts': current,
      'microservice': 'resource-invenotry',
      'msg': data[0],
      'elapsed-ms': elapsedTime
    });
  }
  
  // !code: exports // !end
  module.exports = {
    logger,
    applog
  };
  
  // !code: funcs // !end
  // !code: end // !end
  
  