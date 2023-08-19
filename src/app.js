
// Configure Feathers app. (Can be re-generated.)
// !code: preface // !end
const path = require('path');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./logger');
const grpc = require('./grpc.server');
const grpcService = require('./protos/services/grpc.services');

// !<DEFAULT> code: favicon_import
const favicon = require('serve-favicon');
// !end

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const generatorSpecs = require('../feathers-gen-specs.json');

const mongoose = require('./mongoose');
// !code: imports
const kafka = require('./kafka');
const swagger = require('feathers-swagger');
const { initializeServices } = require('./util/serviceResolvers');
const configs = require('./hooks/configs.js');

// !end
// !code: init // !end

const app = express(feathers());
// !code: use_start // !end
// For CORS need to expose custom headers
// const corsOptions = {
//   exposedHeaders: 'context.params.total'
// };

const corsOptions = {
  exposedHeaders: 'X-Total-Count'
};
app.use(cors(corsOptions));

// !end

// Load app configuration
app.configure(configuration());
// !<DEFAULT> code: init_config
app.set('generatorSpecs', generatorSpecs);
// !end

// Enable security, CORS, compression, favicon and body parsing
app.use(helmet(
  // !code: helmet_config // !end
));
app.use(cors(
  // !code: cors_config // !end
));
app.use(compress(
  // !code: compress_config // !end
));

app.use(express.json(
  // !code: json_config // !end
));
app.use(express.urlencoded(
  // !<DEFAULT> code: urlencoded_config
  { extended: true }
  // !end
));

// !<DEFAULT> code: use_static
// Host the public folder
app.use('/', express.static(app.get('public')));
// !end
// !code: use_end // !end

// Set up Plugins and providers
const isProduction = process.env.NODE_ENV === 'production';

// Set up Plugins and providers
// !code: config_start
app.configure(
    // Reference errors expected with current version of feathers-swagger
    swagger({
        ui: swagger.swaggerUI({
            docsPath: '/docs',
            // Used to set correct URL for swagger UI based on environment.
            // In production the resource-catalogue is behind a nginx reverse proxy
            // and the root path is served from /drm/resource-inventory
            getSwaggerInitializerScript: () => `
                window.onload = function() {
                  window.ui = SwaggerUIBundle({
                    url: "${
                        isProduction ? '/drm/resource-inventory/swagger.json' : '/swagger.json'
                    }",
                    dom_id: '#swagger-ui'
                  });
                };`
        }),
        // This defines that the swagger.json file should be generated in the root path.
        docsJsonPath: '/swagger.json',
        specs: {
            info: {
                title: 'Resource inventory',
                description: 'Resource inventory'
            },
            // https://swagger.io/docs/specification/authentication/bearer-authentication/
            components: {
                securitySchemes: {
                    Bearer: {
                        type: 'http',
                        scheme: 'bearer'
                    }
                }
            },
            security: [{ Bearer: [] }],
            // https://swagger.io/docs/specification/api-host-and-base-path/
            servers: [{ url: isProduction ? '/drm/resource-inventory' : '' }]
        },
        ignore: {
            tags: []
        }
    })
);


// !end
app.configure(express.rest(
  // !code: express_rest // !end
));
app.configure(socketio(
  // !code: express_socketio // !end
));
// Configure database adapters
app.configure(mongoose);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));
// !code: config_end // !end

app.hooks(appHooks);

// Initialize kafka client
kafka.initialize(app);

// Configure GRPC server and its sevices
app.configure(grpc.grpcServer);
app.configure(grpcService.startService)
app.configure(initializeServices);
app.configure(configs);
const moduleExports = app;
// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
