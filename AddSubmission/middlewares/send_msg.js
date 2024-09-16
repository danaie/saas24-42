const amqp = require('amqplib/callback_api');

const sendMessage = (req, res, next) => {
    amqp.connect('amqp://rabbitmq', function(error0, connection) {
        if (error0) {
        throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            let exchange = 'NewSubPubSub';
            let msg = JSON.stringify(req.body);
        
            channel.assertExchange(exchange, 'fanout', {
                durable: false
              });
        
            channel.publish(exchange, '', Buffer.from(msg));
            console.log(" [x] Sent %s", msg);
        });
    });

    next()
}


module.exports = sendMessage;