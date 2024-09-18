const amqp = require('amqplib/callback_api');
const consumingQueues = ['NewSubPubSub', 'remove', 'RequestNewPubSub'];
const addQ = require('./messageHandlers/addQ');
const removeQ = require('./messageHandlers/removeQ')
const requestNew = require('./messageHandlers/requestNew')

function connectToRabbitMQ() {
  amqp.connect('amqp://rabbitmq', function (error0, connection) {
    if (error0) {
      return;
    }

    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      // NewSubmission Pub Sub
      channel.assertExchange(consumingQueues[0], 'fanout', { durable: false });

      channel.assertQueue('', { exclusive: true }, function (error2, q) {
        if (error2) {
          throw error2;
        }

        console.log(` [*] Waiting for messages from ${consumingQueues[0]}. To exit press CTRL+C`);
        channel.bindQueue(q.queue, consumingQueues[0], '');

        channel.consume(q.queue, function (msg) {
          if (msg.content) {
            const parsedMessage = JSON.parse(msg.content.toString());
            addQ(parsedMessage);
          }
        }, { noAck: true });
      });
  
      //===================================================

      // remove Pub Sub
      channel.assertExchange(consumingQueues[1], 'fanout', { durable: false });

      channel.assertQueue('', { exclusive: true }, function (error2, q1) {
        if (error2) {
          throw error2;
        }

        console.log(` [*] Waiting for messages from ${consumingQueues[1]}. To exit press CTRL+C`);
        channel.bindQueue(q1.queue, consumingQueues[1], '');

        channel.consume(q1.queue, function (msg) {
          if (msg.content) {
            const parsedMessage = msg.content.toString();
            removeQ(parsedMessage);
          }
        }, { noAck: true });
      });

      //==============================================

      //Request New Pub Sub

      channel.assertQueue(consumingQueues[2], {
        durable: false
      });

      channel.consume(consumingQueues[2], function(msg) {
        const parsedMessage = JSON.parse(msg.content.toString());
        requestNew(parsedMessage);
      }, {
          noAck: true
      });
    });
  });
}

// Start the connection
connectToRabbitMQ();