const logger = require('../logger');
const jsonPath = require('jsonpath');
const { BadRequest } = require('@feathersjs/errors');

//Getting 'ResourceType' config from master-config service
module.exports = async (context, resource) => {
  const { app } = context;
  const t0 = new Date();
  const result = app.get('ResourceTypeConfig');
  logger.applog('info', t0,`Result is: ${JSON.stringify(result)}`);

  if (!result) {
    throw new BadRequest(`Cannot get 'ResourceType' config from master-config service`);
  }


  logger.applog('info', t0, 'Starting finding baseType');

  const baseType = jsonPath.query(result.masterConfig[0], `$.configCharacteristics[?(@.code === "resourceTypes")].configCharacteristicsValues[?(@.value.type === "${resource}")].value.baseType`);
  const resolvedBaseType = baseType.length !== 0 ? baseType : '[PhysicalResource]';

  logger.applog('info', t0, 'Finished finding baseType');

  return resolvedBaseType;
};
