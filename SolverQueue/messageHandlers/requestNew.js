const mongoose = require('mongoose')
const submissions = require('../dbSchema')

async function requestNew() {
    await mongoose.connect('mongodb://solverq_db:27017')
    const oldest = await submissions.find().sort({timestamp: 1}).limit(1)
    console.log(oldest)

    amqp.connect('amqp://rabbitmq', function(error0, connection) {
        if (error0) {
          throw error0;
        }
        connection.createChannel(function(error1, channel) {
          if (error1) {
            throw error1;
          }

          //Send oldest to the solver
          var newNewQueue = 'sendNew';
      
          channel.assertQueue(newNewQueue, {
            durable: false
          });
      
          channel.sendToQueue(newNewQueue, Buffer.from(oldest));
          console.log(" [x] Sent %s", oldest);

          //Send oldest to the solver
          var updateStatusQueue = 'running';

          channel.assertQueue(updateStatusQueue, {
              durable: false
          });
        
          channel.sendToQueue(updateStatusQueue, Buffer.from(oldest._id));
          console.log(" [x] Sent %s", oldest._id);

        });
      });
}


module.exports = addQ