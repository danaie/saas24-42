const amqp = require('amqplib/callback_api');
const consumingQueues = ['NewSubPubSub', 'RemovePendingPubSub', 'RequestNewPubSub'];
const publishingQueues = ['CreditTransaction', 'RunningPubSub', 'SendNewPubSub'];
const addQ = require('./messageHandlers/addQ');

function connectToRabbitMQ() {
  amqp.connect('amqp://rabbitmq', function (error0, connection) {
    if (error0) {
      return;
    }

    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      // Helper function to consume messages from an exchange
      function consumeMessages(exchange, handler) {
        channel.assertExchange(exchange, 'fanout', { durable: false });

        channel.assertQueue('', { exclusive: true }, function (error2, q) {
          if (error2) {
            throw error2;
          }

          console.log(` [*] Waiting for messages from ${exchange}. To exit press CTRL+C`);
          channel.bindQueue(q.queue, exchange, '');

          // Consume messages from the queue
          channel.consume(q.queue, function (msg) {
            if (msg.content) {
              handler(msg.content.toString());
            }
          }, { noAck: true });
        });
      }

      // Setup different handlers for each exchange
      // Handle NewSubPubSub messages
      consumeMessages(consumingQueues[0], (message) => {
        //console.log("[NewSubPubSub] Received: ", message);
        const parsedMessage = JSON.parse(message);
        addQ(parsedMessage);
      });

    //   // Handle RemovePendingPubSub messages
    //   consumeMessages(consumingQueues[1], (message) => {
    //     console.log("[RemovePendingPubSub] Received: ", message);
    //     // Add your custom logic for RemovePendingPubSub messages here
    //   });

    //   // Handle RequestNewPubSub messages
    //   consumeMessages(consumingQueues[2], (message) => {
    //     console.log("[RequestNewPubSub] Received: ", message);
    //     // Add your custom logic for RequestNewPubSub messages here
    //   });
    });
  });
}

// Start the connection
connectToRabbitMQ();
