const amqp = require('amqplib/callback_api');

const RABBITMQ_URL = 'amqp://rabbitmq'; // Change to your RabbitMQ server URL
const EXCHANGE_NAME = 'new_user';

function publishMsg(msg) {
  // Connect to RabbitMQ
  amqp.connect(RABBITMQ_URL, (err, connection) => {
    if (err) {
      console.error('Failed to connect to RabbitMQ:', err);
      return;
    }

    // Create a channel
    connection.createChannel((error1, channel) => {
      if (error1) {
        console.error('Failed to create channel:', error1);
        return;
      }
      console.log("connection and channel made");

      // Assert the exchange
      channel.assertExchange(EXCHANGE_NAME, 'fanout', {
        durable: false
      });
      console.log("exchange asserted");

      // Publish the message
      channel.publish(EXCHANGE_NAME, '', Buffer.from(msg));
      console.log(" [x] Sent '%s'", msg);

      // Close the connection after a short timeout
      setTimeout(() => {
        connection.close();
      }, 500);
    });
  });
}

module.exports = { publishMsg };