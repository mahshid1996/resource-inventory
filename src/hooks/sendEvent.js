const _ = require('lodash');
const uuid = require('uuid');
const camelCase = require('camelcase');
const {
  send
} = require('../kafka');
const logger = require('../logger');


async function sendEvent(context) {
  var t0 = new Date();
  const {
    method,
    path,
    result
  } = context;
  const camelCasePath = camelCase(path);
  const methods = {
    create: 'CreateEvent',
    update: 'UpdateEvent',
    patch: 'PatchEvent',
    remove: 'RemoveEvent'
  };
  const eventName = camelCasePath.replace(/v\d\//, '');
  const eventType = `${eventName}${methods[method]}`;

  const event = {
    eventId: uuid.v4(),
    eventTime: new Date().toISOString(),
    eventType,
    event: {
      [eventName]: result
    }
  };

  if (eventType == 'logicalResourceRemoveEvent' && context.params.provider == 'DRMSwap' && context.params.data) {

    event.event.externalId = context.params.data.externalId;
    event.event.orderItemId = context.params.data.orderItemId;

  }

  try {
    await send(eventType, event);
    logger.applog('info', t0, `Send kafka event: ${JSON.stringify({ eventType, ..._.omit(event, 'event') })}`);
    logger.applog('debug', t0, `Send kafka event: ${JSON.stringify({ eventType, ...event })}`);

  } catch (error) {
    logger.applog('error', t0, `Kafka event ${error}`);
  }

  return context;
};
module.exports = {
  sendEvent
};
