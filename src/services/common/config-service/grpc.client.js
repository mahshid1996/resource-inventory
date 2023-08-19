/* eslint-disable no-console */
/* eslint-disable linebreak-style */
//var gserver = require('./src/grpc.server');
var grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const generteJWTtoken = require('./generateToken.js');
const logger = require('../../../logger');


//Following options object closely approximates the existing behavior of grpc.load
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
};


var meta = new grpc.Metadata();

//var client;
//Handling all clients 
async function configServiceClientdata(key, arg, service, appIp) {
  var packageDefinition;
  var proto;

  //creating client based on the service name and request transformation 
  switch (service) {
    case 'master-config':
      //loading proto file
      packageDefinition = protoLoader.loadSync('src/protos/master-config.proto', options);
      proto = grpc.loadPackageDefinition(packageDefinition);
     
      var client = new proto.protos.MasterConfig(appIp, grpc.credentials.createInsecure());
      obj = {
        'id': '',
        'masterConfig': {}
      };
      obj.masterConfig = arg;
      obj.id = arg.id;
      var rresponse = creteMetadata(key, obj, arg, client);
      return rresponse;
      break;
   
  }


}
async function creteMetadata(key, obj, arg, client) {
  var request;
  var encKey;
  if (key == 'ReadAll' || 'ReadAllResourceTypes') {
    encKey = 'configReadAll';
    request = arg;
  } else {
    request = obj;
    encKey = key + request.length;
  }

  var user = {
    id: encKey,
    user: 'configForResource',
  };
  
  //JWT token generator
  var token = await generateJWTToken(user);
  var tbearer = 'Bearer' + ' ' + token;
  // If metadata Doesn't have an Authorization key, then create a new one. Else update value to the new one.
  if (meta.get('Authorization').length === 0) {
    meta.add('Authorization', tbearer);
  } else {
    meta.set('Authorization', tbearer);
  }
 
  var mresponse = callMethod(key, request, meta, client);
  return mresponse;
}


function callMethod(key, request, meta, client) {
  // Based on the method we doing respect operation 
  switch (key) {
    case 'ReadAll':
      return getReadAll(request, meta, client);
    case 'ReadById':
      return readById(request, meta, client);
    case 'Create':
      return create(request, meta, client);
    case 'Update':
      return update(request, meta, client);
    case 'Delete':
      return deleteMethod(request, meta, client);
    case 'Patch':
      return patch(request, meta, client);
    case 'ReadAllResourceTypes':
      return getReadAllTypes(request, meta, client);

  }
}

function generateJWTToken(user) {

  return new Promise((resolve, reject) => {
    return setTimeout(() => resolve(generteJWTtoken.generateJWTtoken(user)), 10);
  });
}

function getReadAll(request, meta, client) {

  // Get current time
  var t0 = new Date();

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      logger.applog('debug', t0, 'before');

      client.ReadAll(request, meta, function (error, response) {

        if (error) {
          logger.applog('error', t0, 'Error in ReadAll method ', JSON.stringify(error));
          reject(error);
        } else {
          resolve(response);
        }
      });
    }, 10);

  });
}

function getReadAllTypes(request, meta, client) {

  // Get current time
  var t0 = new Date();

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      logger.applog('debug', t0, 'before');

      client.ReadAllResourceTypes(request, meta, function (error, response) {

        if (error) {
          logger.applog('error', t0, 'Error in ReadAll method ', JSON.stringify(error));
          reject(error);
        } else {
          resolve(response);
        }
      });
    }, 10);

  });
}

function readById(request, meta, client) {

  // Get current time
  var t0 = new Date();

  return new Promise((resolve, reject) => {
    setTimeout(() => {

      client.ReadById(request, meta, (error, response) => {
        if (!error) {
          resolve(response);
        } else {
          logger.applog('error', t0, 'Error in ReadById method ', JSON.stringify(error));
          reject(error);
        }
      });

    }, 10);
  });
}

function deleteMethod(request, meta, client) {

  // Get current time
  var t0 = new Date();

  return new Promise((resolve, reject) => {
    setTimeout(() => {

      client.Delete(request, meta, (error, response) => {

        if (!error) {
          resolve(response);
        } else {
          logger.applog('error', t0, 'Error in Delete method ', JSON.stringify(error));
          reject(error);
        }
      });

    }, 10);

  });
}



function create(request, meta, client) {

  // Get current time
  var t0 = new Date();

  return new Promise((resolve, reject) => {
    setTimeout(() => {

      client.Create(request, meta, (error, response) => {

        if (!error) {
          logger.applog('info', 'Resource created resource by Id successfully ', JSON.stringify(response));
          resolve(response);
        } else {
          logger.applog('error', t0, 'Error in Create method ', JSON.stringify(error));
          reject(error);
        }
      });

    }, 10);
  });
}

function update(request, meta, client) {

  // Get current time
  var t0 = new Date();

  return new Promise((resolve, reject) => {
    setTimeout(() => {

      client.Update(request, meta, (error, response) => {

        if (!error) {
          resolve(response);
        } else {
          logger.applog('error', t0, 'Error in Update method ', JSON.stringify(error));
          reject(error);
        }
      });

    }, 10);
  });
}

function patch(request, meta, client) {

  // Get current time
  var t0 = new Date();

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      client.Patch(request, meta, (error, response) => {

        if (!error) {
          resolve(response);
        } else {
          logger.applog('error', t0, 'Error in Patch method ', JSON.stringify(error));
          reject(error);
        }
      });

    }, 10);
  });
}

function closeClient() {
  grpc.closeClient(client);

}

module.exports = {
  configServiceClientdata,
  closeClient,
  generateJWTToken
};
 
