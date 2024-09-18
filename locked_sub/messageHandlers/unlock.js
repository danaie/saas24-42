const mongoose = require('mongoose');
const amqp = require('amqplib/callback_api');
const submissions = require('../dbSchema');

async function unlock(msg) {
    await mongoose.connect('mongodb://locked_db:27017')

    const del = await submissions.findOneAndDelete({ _id: msg });

    if (del) {
        del.status = "Finished";
        delete del.unlockPrice;
        const delString = JSON.stringify(del);

        amqp.connect('amqp://rabbitmq', function(error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function(error1, channel) {
                if (error1) {
                    throw error1;
                }

                const queue = 'unlock';

                channel.assertQueue(queue, {
                    durable: false
                });

                channel.sendToQueue(queue, Buffer.from(delString));
                console.log(" [x] Sent %s", delString);
            });
        });
    } else {
        console.log('No document found to delete.');
    }
}

module.exports = unlock;
