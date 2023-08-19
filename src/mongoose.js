// mongoose.js - Mongoose adapter
const mongoose = require('mongoose');
const logger = require('./logger');

// Get currnet time
var t0 = new Date();
// !code: imports // !end
// !code: init // !end

module.exports = function (app) {
  mongoose.Promise = global.Promise;
  mongoose.connect(app.get('mongodb'), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
    .then(({
      connection
    }) => {
      // eslint-disable-next-line no-console
      logger.applog('info', t0, `connected to "${connection.name}" database at ${connection.host}:${connection.port}`);
      return connection;
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      logger.applog('error', t0, error);
      process.exit(1);
    });
  // !code: func_init // !end

  app.set('mongooseClient', mongoose);
  // !code: more // !end
};

// !code: funcs // !end
// !code: end // !end
