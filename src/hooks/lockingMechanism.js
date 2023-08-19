const { BadRequest } = require('@feathersjs/errors');
const getResourceType = require('../hooks/getResourceType.js');
const ObjectId = require('mongodb').ObjectId;

const logger = require('../logger');

/**
 * locking mechanism for blocking resource for doing special action
 */
async function lockingMechanism(context) {
  const { app, data, path } = context;
  

 if(path === 'v1/change-resource-access'){
   //get current date time
   const t0 = new Date();
   logger.applog('info', t0, 'Locking mechanism started');
 
   //validate required fields
   if (!data.value || !data['@type']) {
     throw new BadRequest('Missing required fields');
   }

   //specifying query
   let query = {
     value: data.value,
     "@type": data["@type"],
     $or: [{ resourceAccess: { $exists: false } },  { resourceAccess: null },
      { resourceAccess: "" }],
   };
   if (data.category) {
     query = {
       value: data.value,
       "@type": data["@type"],
       $or: [{ resourceAccess: { $exists: false } },  { resourceAccess: null },
        { resourceAccess: "" }],
       category: { $in: data.category.map((value) => ObjectId(value)) },
     };
   }

   const resourceType = await getResourceType(context, data['@type']);
   const serviceName = (resourceType[0] === 'LogicalResource')? "v1/logical-resource" : "v1/physical-resource" ;

    const resourceService = app.service(serviceName);
    const collection = resourceService.Model.collection;

   //use the `collection` object to execute a raw MongoDB update operation
   logger.applog('debug', t0, `Starting updating resource with value: ${data.value} and type: ${data['@type']}`);
    const updateResult = await collection.findOneAndUpdate(
     query, // your query criteria
     { $set: { resourceAccess: t0} }, // your update operation
     { returnOriginal: false } // set `returnOriginal` to false to get the updated document
   );
   

  if (updateResult?.lastErrorObject?.updatedExisting === false) {
     //resource is already locked, return an error
     throw new BadRequest(`Resource with value: ${data.value} and type: ${data['@type']} is locked or 'resourceAccess' does not exist`);
    }

   logger.applog('debug', t0, `Finished updating resource with value: ${data.value} and type: ${data['@type']}`);

   //validate the update result
    if (!updateResult || !updateResult.value) {
      throw new Error('Failed to update the resource');
    }
 
   //access the updated document from the update result
   const updatedDocument = updateResult.value;

   //validate the updated document
  if (!updatedDocument) {
    throw new Error('Failed to retrieve the updated document');
  }

   context.result = {
     id:updatedDocument._id,
     '@type':updatedDocument['@type'],
     '@baseType':updatedDocument['@baseType'],
     value : updatedDocument.value,
     'resourceStatus':updatedDocument.resourceStatus,
     resourceAccess:updatedDocument.resourceAccess
   };
   logger.applog('info', t0, 'Locking mechanism done'); 
 }
  return context;
}

module.exports = {
  lockingMechanism,
};
