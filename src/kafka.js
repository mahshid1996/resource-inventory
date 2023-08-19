const kafka = require('kafka-node');
const {promisify} = require('util');
const logger = require('./logger');

const kafkaProducer = () => {
  let producer;
  var t0 = new Date();

  const initialize = app => {
    try {
      const {Producer} = kafka;
      const {
        topic,
        brokers
      } = app.get('kafka');
      const client = new kafka.KafkaClient({
        kafkaHost: brokers
      });
      const createTopic = promisify(client.createTopics).bind(client);
      const checkTopic = args => {
        return new Promise(resolve => {
          client.topicExists(args, error => {
            if (error) resolve(error);
          });
        });
      };

      client.once('connect', async () => {
        const missingTopic = await checkTopic([topic]);

        if (missingTopic) {
          await createTopic([{
            topic,
            partitions: 1,
            replicationFactor: 1
          }]);
          logger.applog('debug', t0, `Created a new kafka topic '${topic}'.`);
        }
      });

      client.on('error', error => {
        logger.applog('error', t0, `Kafka client ${error}`);
      });


const options = {
  // The amount of time in milliseconds to wait for all acks before considered, default 100ms
  ackTimeoutMs: 50,
  // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
  partitionerType: 2
}


      producer = new Producer(client,options);

      producer.on('ready', () => {
        logger.applog('info', t0, `Connected to kafka brokers at ${brokers}`);
      });

      producer.on('error', error => {
        logger.applog('error', t0, `Kafka producer ${error}`);
      });

      return producer;
    } catch (error) {
      logger.applog('error', t0, `Kafka initialize ${error}`);
    }
  };

  const send = (topic, messages) => {
    const payload = [{
      topic,
      messages: JSON.stringify(messages)
    }];

    return new Promise((resolve, reject) => {
      producer.send(payload, (error, response) => {
        if (!error) {
          resolve(response);
        }
        reject(error);
      });
    });
  };

  return {
    initialize,
    send
  };
};

const {
  initialize,
  send
} = kafkaProducer();

module.exports = {
  initialize,
  send
};
