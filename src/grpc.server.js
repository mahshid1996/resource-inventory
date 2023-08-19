/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
/* eslint-disable no-console */
var grpc = require('@grpc/grpc-js');
var server = new grpc.Server();
const logger = require('./logger');
const protoLoader = require('@grpc/proto-loader');
const jwt = require('jsonwebtoken');
const config = require('config');
//var grpcService = require('./protos/services/grpc.services')

// Get current time
var t0 = new Date();

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}

// Generic function to load proto files
function loadProtoDefinition(path){
  const packageDefinition = protoLoader.loadSync(path,options);
  const proto = grpc.loadPackageDefinition(packageDefinition);

  return grpc.loadPackageDefinition(proto);
}


// Validate Internal JWT sent by microservice to authenticate calls
function validateJWT(call) {
  var result;
  
  var authToken = call.metadata.get("authorization");
  
  if (authToken.length > 0) {
    var beareToken = authToken[0].split(' ');

    jwt.verify(beareToken[1], config.jwt.secret, (err, authData) => {
    

      if (err) {

        logger.applog('debug', t0, 'Token is not valid! ' + err);

        result = false;
      } else {

        logger.applog('debug', t0, 'Token is valid!');

        result = true;
      }

    });

    return result;

  } else {

    logger.applog('debug', t0, 'Authentication failed!! ');

    return result = false;
  }
}

// Start grpc server
function grpcServer(app) {

  const {
    host,
    port
  } = app.get('gRPC');

  const ip = host + ':' + port;

  server.bindAsync(ip, grpc.ServerCredentials.createInsecure(), (err, port) =>{

    if (err != null) {

      logger.applog('error', t0, err);

    }else{

      logger.applog('info', t0, 'gRPC server started on ' + ip);

      // eslint-disable-next-line no-console
      server.start();
      return server;
    }

  });
}

// Send customized gRPC errors
function sendError(code, message){
  var err = new Error();
  err.code = code;
  err.message = message;

  return err
}

// Expose gRPC server to services
function getServer(){
  return server;
}

module.exports = {
  grpcServer,
  validateJWT,
  loadProtoDefinition,
  getServer,
  sendError
};

