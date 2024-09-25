const express = require('express');
const amqp = require('amqplib/callback_api');
const app = express();

app.use(express.json());

app.post('/remove', (req, res) => {
    amqp.connect('amqp://rabbitmq', function(error0, connection) {
        if (error0) {
        console.error("Connection error:", error0);
        return res.status(500).send("Failed to connect to RabbitMQ");
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                console.error("Channel error:", error1);
                return res.status(500).send("Failed to create channel");
            }
            let exchange = 'remove';
            let {id} = req.body;
        
            channel.assertExchange(exchange, 'fanout', {
                durable: false
              });
        
            channel.publish(exchange, '', Buffer.from(id));
            console.log(" [x] Sent %s", id);
        });
    });
    res.status(200).send('Ok');
});

app.listen(8000, () => console.log(`Remove is listening on port 8000!`));