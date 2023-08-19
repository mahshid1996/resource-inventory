const axios = require('axios');
const https = require('https');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('config');
const {
  Strategy
} = require('passport-http-bearer');

const logger = require('./logger');

const JWTSecret = config.jwt.secret;

// Get currnet time
var t0 = new Date();

const authentication = () => {
  const getUserInfo = async (token, host) => {
    const {
      data
    } = await axios({
      method: 'get',
      timeout: 10000,
      url: `${host}/oauth2/userinfo?schema=openid`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    });
    
    return data;
  };

  const DCMTokenStrategy = () =>
    new Strategy(async (token, callback) => {
      try {
        const userInfo = jwt.verify(token, JWTSecret);

        if (!userInfo) {
          return callback(null, false);
        }

        return callback(null, userInfo);
      } catch (error) {
        return callback(null, false);
      }
    });

  const SSOTokenStrategy = app =>
    new Strategy(async (token, callback) => {
      try {
        const {
          host
        } = app.get('sso');
        const userInfo = await getUserInfo(token, host);

        if (!userInfo) {
          return callback(null, false);
        }

        return callback(null, userInfo);
      } catch (error) {
        logger.applog('error', t0, error.message);
        return callback(null, false);
      }
    });

  const initialize = app => {
    passport.use('DCMToken', DCMTokenStrategy());
    passport.use('SSOToken', SSOTokenStrategy(app));

    return passport;
  };

  return {
    initialize
  };
};

const {
  initialize
} = authentication();

module.exports = {
  initialize
};
