const mongoose = require('mongoose')
const submissions = require('../dbSchema')
const amqp = require('amqplib/callback_api');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function requestNew(msg) {
    await mongoose.connect('mongodb://solverq_db:27017')

    let oldest = await submissions.find().sort({timestamp: 1})

    while((oldest.length==1 && msg!="Fresh") || oldest.length==0){
      console.log('SolverQueue lenght', oldest.length, 'message:', msg)
      console.log("No submissions available, sleeping for 5 seconds...");
      console.log(oldest)
      await sleep(5000);
      oldest = await submissions.find().sort({timestamp: 1})
    }

    let old = oldest[0]
    if(msg!="Fresh"){
      await submissions.deleteOne({_id: old.id});
      old = oldest[1]
    }
    
    amqp.connect('amqp://rabbitmq', function(error0, connection) {
        if (error0) {
          throw error0;
        }
        connection.createChannel(function(error1, channel) {
          if (error1) {
            throw error1;
          }

          //Send oldest to the solver
          const sendNewQueue = 'sendNew';
      
          channel.assertQueue(sendNewQueue, {
            durable: true
          });
          
          channel.sendToQueue(sendNewQueue, Buffer.from(JSON.stringify(old)));
          console.log(" [x] Sent %s", old);

          //Send oldest to the solver
          const updateStatusQueue = 'running';

          channel.assertQueue(updateStatusQueue, {
              durable: false
          });
        
          console.log(" [x] Sent %s", old._id);
          channel.sendToQueue(updateStatusQueue, Buffer.from(old._id));
          console.log(" [x] Sent %s", old._id);
        });
      });
}


module.exports = requestNew