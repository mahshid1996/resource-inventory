/* eslint-disable no-console */
/* eslint-disable linebreak-style */

// Import required modules
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const generateJWTToken = require('../util/generateToken');
const config = require('config');

// Configure protocol buffer message handling options
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

// Create gRPC metadata and load secret from config
const meta = new grpc.Metadata();
const secret = config.jwt.secret;

// Function to handle different services and execute operations
async function clientdata(key, arg, service, appIp) {
  let packageDefinition;
  let proto;

  switch (service) {
    case 'logical':
      // Load logical resource proto definition and create client
      packageDefinition = protoLoader.loadSync('./src/protos/logical-resource.proto', options);
      proto = grpc.loadPackageDefinition(packageDefinition);
      return createClientAndExecute(key, arg, appIp, proto.protos.LogicalResource);
    case 'physical':
      // Load physical resource proto definition and create client
      packageDefinition = protoLoader.loadSync('./src/protos/physical-resource.proto', options);
      proto = grpc.loadPackageDefinition(packageDefinition);
      return createClientAndExecute(key, arg, appIp, proto.protos.PhysicalResource);
    case 'reservation':
      // Load reservation proto definition and create client
      const reservationDef = protoLoader.loadSync('./src/protos/reservation.proto', options);
      const reservationProto = grpc.loadPackageDefinition(reservationDef);
      return createClientAndExecute(key, arg, appIp, reservationProto.protos.Reservation);
    default:
      throw new Error(`Unknown service: ${service}`);
  }
}

// Create client and execute service-specific operations
async function createClientAndExecute(key, arg, appIp, clientClass) {
  const client = new clientClass(appIp, grpc.credentials.createInsecure());
  const obj = {
    id: arg.id,
    [`${arg.resourceType.toLowerCase()}Resource`]: arg,
  };
  return createMetadataAndCall(key, obj, arg, client);
}

// Create metadata and call the gRPC method
async function createMetadataAndCall(key, obj, arg, client) {
  // Extract provider and add to metadata
  const provider = arg.provider;
  if (provider) {
    delete arg.provider;
    meta.add('provider', provider);
  }
  const user = {
    sub: 'drmInternal',
    permissions: 'drm.*',
  };
  const token = await generateJWTToken(user, secret);
  const tbearer = `Bearer ${token}`;

  // Manage authorization metadata
  if (meta.get('Authorization').length === 0) {
    meta.add('Authorization', tbearer);
  } else {
    meta.set('Authorization', tbearer);
  }

  // Call the specified gRPC method
  return callMethod(key, obj, meta, client);
}

// Function to call the appropriate gRPC method
function callMethod(key, request, meta, client) {
  switch (key) {
    case 'ReadAll':
      return getReadAll(request, meta, client);
    case 'ReadById':
      // Handle other cases...
    default:
      throw new Error(`Unknown method: ${key}`);
  }
}

// Rest of your methods...

// Close the gRPC client connection
function closeClient(client) {
  grpc.closeClient(client);
}

// Export the functions for use in other modules
module.exports = {
  clientdata,
  closeClient,
};
