const express = require('express')
const app = express()
const amqp = require('amqplib/callback_api');

app.use(express.json());

app.post('/unlock', (req, res) => {
    amqp.connect('amqp://rabbitmq', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
            throw error1;
            }
            var queue = 'unlockRequest';
            let {id} = req.body;
            id = String(id)
            channel.assertQueue(queue, {
            durable: false
            });
        
            channel.sendToQueue(queue, Buffer.from(id));
            console.log(" [x] Request to unlock %s", id);
        });
        });

    res.status(200).send('ok')
})


app.listen(9000, () => console.log(`Unlock is listening on port 9000!`));