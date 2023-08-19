// A hook that logs service method before, after and error
// See https://github.com/winstonjs/winston for documentation
// about the logger.
const logger = require('../logger');

// Get current time
var t0 = new Date();

// To see more detailed messages, uncomment the following line:
// logger.level = 'debug';

module.exports = function () {
  return context => {

    // This debugs the service call and a stringified version of the hook context
    // You can customize the message (and logger) to your needs

    if (context.type == 'after') {

      logger.applog('debug', t0, `${context.type} app.service('${context.path}') for ${context.method} method with input data: ${getData(context)}!`);
      logger.applog('debug', t0, `${context.type} app.service('${context.path}') for ${context.method} method with output data: ${getResult(context)}!`);

    } else {
      logger.applog('debug', t0, `${context.type} app.service('${context.path}') for ${context.method} method with params: ${JSON.stringify(context.params)}!`);
    }

    // if (typeof context.toJSON === 'function' && logger.level === 'debug') {
    //   logger.applog('debug',t0,'Hook Context'+ util.inspect(context, { colors: false }))
    // }

    logger.applog('info', t0, `${context.type} app.service('${context.path}') for ${context.method}!`);

    if (context.error) {
      logger.applog('error', t0, 'error: ' + context.error.stack);
    }
  };
};


// Get Input data from context for logger
function getData(context) {

  switch (context.method) {
  case 'create':
    return JSON.stringify(context.data);
  case 'find':
    return '';
  case 'get':
    return '';
  case 'update':
    return JSON.stringify(context.data);
  case 'patch':
    return JSON.stringify(context.data);
  case 'remove':
    return JSON.stringify(context.id);
  }
}

// Get Output data from context for logger
function getResult(context) {

  switch (context.method) {
  case 'create':
    return JSON.stringify(context.result);
  case 'find':
    return JSON.stringify(context.result.data);
  case 'get':
    return JSON.stringify(context.result);
  case 'update':
    return JSON.stringify(context.result);
  case 'patch':
    return JSON.stringify(context.result);
  case 'remove':
    return JSON.stringify(context.result);
  }
}
