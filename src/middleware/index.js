
// Configure middleware. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end
const parse = require('url-parse');
// eslint-disable-next-line no-unused-vars
let moduleExports = app => {
  // !code: func_init 
  const passport = require('../authentication').initialize(app);
  // !end
  // Add your custom middleware here. Remember that
  // in Express, the order matters.
  // !code: middleware 
  

  const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
        app.use(passport.authenticate(['DCMToken', 'SSOToken'], { session: false }));
    }

    //we need to get url & user for checkPermission
    app.use((req, res, next) => {
        // X-Host for Production, Host for development
        const url = parse(
            req.get('X-Host') ? req.get('X-Host') : `${req.protocol}://${req.get('host')}`
        );
        req.feathers.url = url;
        req.feathers.user = req.user;
        next();
    });


  // !end
  // !code: func_return // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
