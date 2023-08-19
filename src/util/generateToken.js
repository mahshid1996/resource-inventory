const jwt = require("jsonwebtoken");
const logger = require('../logger');

//Generating JWT token
module.exports.generateJWTtoken = function (user, secret) {
  return new Promise(function (resolve, reject) {
    //Getting current time
    var t0 = new Date();
    jwt.sign({ user }, secret, (err, token) => {
      if (err) {
        logger.applog('error', t0, `Tocken generation error + ${JSON.stringify(err)}`);
        reject(err);
      } else {
        logger.applog('info', t0, `Tocken generated:+ ${token}`);
        resolve(token);
      }
    });
  });
};
