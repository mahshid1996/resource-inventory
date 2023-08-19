/* eslint-disable no-console */
// Start the server. (Can be re-generated.)
// !code: preface // !end
const logger = require('./logger');
const app = require('./app');
// !code: imports // !end
// !code: init // !end

const host = app.get('host');
const port = app.get('port');
const server = app.listen(port);

// Get current time
var t0 = new Date();
// !code: init2 // !end

process.on('unhandledRejection', (reason, p) => {

  // !code: unhandled_rejection_log
  logger.applog('error', t0, 'Unhandled Rejection at: Promise ' + p + ' with reason: ' + reason);
  // !end
  // !code: unhandled_rejection // !end
});

server.on('listening', async () => {
  // ! code: listening_log
  logger.applog('info', t0, 'Feathers application started on http://' + host + ':' + port);

  // !end
  // !code: listening // !end
  // !code: listening1 // !end
});
// !code: funcs // !end
// !code: end // !end