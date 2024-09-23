const mongoose = require('mongoose')
const submissions = require('../dbSchema')
const amqp = require('amqplib/callback_api');

async function addLocked(msg) {
    await mongoose.connect('mongodb://locked_db:27017')

    let message = JSON.parse(msg);
    console.log('Received message:');
    message.status = "locked"
    const sub = await submissions.create(message)
    console.log('Added the following submission in Locked Submissions')
    console.log(sub)

    amqp.connect('amqp://rabbitmq', function(error0, connection) {
        if (error0) {
          throw error0;
        }
        connection.createChannel(function(error1, channel) {
          if (error1) {
            throw error1;
          }
          var queue = 'analytics_queue';
      
          channel.assertQueue(queue, {
            durable: true
          });
      
          channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
          console.log(" [x] Sent to analytics a locked entry");
        });
      });
}




module.exports = addLocked