const express = require('express')
const app = express()
const amqp = require('amqplib/callback_api');
const consumingQueues = ['remove', 'lockedPubSub', 'unlockRequest'];
const showLocked = require('./middlewares/showLocked')
const showOneLocked = require('./middlewares/showOneLocked')
const removeLocked = require('./messageHandlers/removeLocked')
const addLocked = require('./messageHandlers/addLocked')
const unlock = require('./messageHandlers/unlock')



app.get('/locked/:id', [showLocked], (req, res) => {
  res.status(200).send('Request handled by showLocked middleware');
});

app.get('/locked/:id', [showOneLocked], (req, res) => {
  res.status(200).send('Request handled by showOneLocked middleware');
});


app.listen(4000, () => console.log(`NewSubmission is listening on port ${4000}!`))


function connectToRabbitMQ() {
    amqp.connect('amqp://rabbitmq', function (error0, connection) {
      if (error0) {
        return;
      }
  
      connection.createChannel(function (error1, channel) {
        if (error1) {
          throw error1;
        }
  
        // remove Pub Sub
        channel.assertExchange(consumingQueues[0], 'fanout', { durable: false });
  
        channel.assertQueue('', { exclusive: true }, function (error2, q) {
          if (error2) {
            throw error2;
          }
  
          console.log(` [*] Waiting for messages from ${consumingQueues[0]}. To exit press CTRL+C`);
          channel.bindQueue(q.queue, consumingQueues[0], '');
  
          channel.consume(q.queue, function (msg) {
            if (msg.content) {
              const parsedMessage = msg.content.toString();
              removeLocked(parsedMessage);
            }
          }, { noAck: true });
        });
    
        //===================================================
  
        // Lock Pub Sub
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
              addLocked(parsedMessage);
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
          unlock(parsedMessage);
        }, {
            noAck: true
        });
      });
    });
  }
  
  // Start the connection
  connectToRabbitMQ();
