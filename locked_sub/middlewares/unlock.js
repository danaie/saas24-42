const mongoose = require('mongoose')
const amqp = require("amqplib/callback_api");
const submissions = require('../dbSchema');
const axios = require('axios').default;


const unlock = async(req, res, next) => {
    try{
        await mongoose.connect('mongodb://locked_db:27017');
        const { id } = req.params;
        console.log('Unlocking submission with ID:', id);
        const costArray = await submissions.find({ _id : id }).select('extra_credits user_id');
        const cost = costArray[0].extra_credits
        const user_id = costArray[0].user_id
        console.log('Extra credits needed', cost)

        const data = {
            "amount": -1*cost,
            "user_id": user_id
        }

        console.log(data)
        const response = await axios.post(`http://credit-transaction:8080/edit_credits`, data);
        if(response.status === 200){
            const del = await submissions.findByIdAndDelete(id)
            amqp.connect('amqp://rabbitmq', function(error0, connection) {
                if (error0) {
                  throw error0;
                }
                connection.createChannel(function(error1, channel) {
                  if (error1) {
                    throw error1;
                  }
                  // const queue = 'finished_submission';
                  // const msg = JSON.stringify(del);
                  // console.log('Del is', del)
                  // channel.assertQueue(queue, {
                  //   durable: false
                  // });
              
                  // channel.sendToQueue(queue, Buffer.from(msg));

                  //console.log(" [x] Sent %s", msg);
                  const exchange = 'finished_submission';
                  const msg = JSON.stringify(del);
                  console.log('Message to be sent:', msg);

                  // Assert the exchange and publish the message
                  channel.assertExchange(exchange, 'fanout', { durable: false });
                  channel.publish(exchange, '', Buffer.from(msg)); // Fanout ignores routing key

                  console.log(" [x] Sent message to exchange %s: %s", exchange, msg);
                });
              });
            next();
        }else{
             res.status(406).send('Not enough credits')
        }
    }catch(error){
        console.error('Error while processing the request:', error.message || error);
        res.status(500).send('Internal Server Error.');
    }
}



// const data = {
//     "amount": -50,
//     "user_id": user_id
// }

module.exports = unlock;
