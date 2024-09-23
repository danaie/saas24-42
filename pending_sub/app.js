const express = require("express");
const cors = require("cors");
const sequelize = require("./connect_db");
var initModels = require("./models/init-models");
const amqp = require("amqplib");
const problems = require("./models/problems");
const http = require("axios");
// sequelize.sync({ force: true });
sequelize.sync(); 


var models = initModels(sequelize);

async function newSub() {
    try {
        // Establish connection
        const connection = await amqp.connect(`amqp://rabbitmq`);
        
        // Create a channel
        const channel = await connection.createChannel();

        const exchange = 'NewSubPubSub';

        // Assert exchange
        await channel.assertExchange(exchange, 'fanout', { durable: false });

        // Assert queue
        const { queue } = await channel.assertQueue('', { exclusive: true });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        // Bind queue
        await channel.bindQueue(queue, exchange, '');

        // Consume messages asynchronously
        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                try {
                    const data = JSON.parse(msg.content.toString());
                    console.log('Received message:', data);

                    // Save to the database
                    const prob = await models.problems.create({
                        id: data._id,
                        user_id: data.user_id,
                        username: data.username,
                        status: true,
                        submission_name: data.submission_name,
                        locations: data.locations,
                        num_vehicles: data.num_vehicles,
                        depot: data.depot,
                        max_distance: data.max_distance,
                        timeStamp: data.timestamp
                    });

                    console.log(prob);

                    // Acknowledge message
                    channel.ack(msg);
                } catch (error) {
                    console.error('Error processing message:', error);
                    // Optionally: reject the message (without re-queueing)
                    channel.nack(msg, false, false);
                }
            }
        }, { noAck: false });  // Changed noAck to false to ensure manual acknowledgment
    } catch (error) {
        console.error('Error in newSub:', error);
    }
}


async function changeStatus() {
    try {
        const connection = await amqp.connect(`amqp://rabbitmq`);
        const channel = await connection.createChannel();
        const queue = "running"; //running_sudmission sends msg {problem_id:""}

        await channel.assertQueue(queue, { durable: false });

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const data = msg.content.toString();
                console.log('Received message:', data);
                const prob = await models.problems.findByPk(data);
                if (prob === null) {
                    console.error("Problem not found");//it should never came here
                } else {
                    prob.status = false;
                    await prob.save();
                }
                channel.ack(msg);
            }
        }, { noAck: false });
        console.log(`Waiting for messages in queue: ${queue}`);
    } catch (error) {
        console.error("Failed to consume messages:", error);
    }
}

async function remove() {
    try {
        // Connect to RabbitMQ
        const connection = await amqp.connect(`amqp://rabbitmq`);
        const channel = await connection.createChannel();
        const exchange = 'remove';

        // Assert the exchange
        await channel.assertExchange(exchange, 'fanout', { durable: false });

        // Assert the queue
        const { queue } = await channel.assertQueue('', { exclusive: true });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        // Bind queue to the exchange
        await channel.bindQueue(queue, exchange, '');

        // Consume messages
        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                try {
                    const data = msg.content.toString();
                    console.log('Received message:', data);

                    // Find the problem by primary key (data is the problem ID)
                    const prob = await models.problems.findByPk(data);
                    if (prob === null) {
                        console.error("Problem not found");
                    } else {
                        try {
                            // Make an HTTP POST request to update the credits
                            const res = await http.post('http://credit-transaction:8080/edit_credits', {
                                user_id: prob.user_id,
                                amount: 1
                            });

                            // Check if the response status is 200
                            if (res.status === 200) {
                                // If successful, delete the problem
                                await prob.destroy();
                                console.log('Problem deleted successfully');
                            } else {
                                // Log non-200 responses
                                console.log('Failed to edit credits. Response:', res.status, res.data);
                            }
                        } catch (httpError) {
                            // Catch errors in the HTTP request
                            console.error('Error in HTTP request:', httpError.message || httpError);
                        }
                    }

                    // Acknowledge the message after processing
                    channel.ack(msg);
                } catch (err) {
                    console.error('Error processing message:', err);
                    // Optionally reject the message (without re-queueing)
                    channel.nack(msg, false, false);
                }
            }
        }, { noAck: false });

        console.log(`Waiting for messages in queue: ${queue}`);
    } catch (error) {
        console.error("Failed to consume messages:", error);
    }
}

async function removeLocked() {
    try {
        const connection = await amqp.connect(`amqp://rabbitmq`);
        const channel = await connection.createChannel();
        const exchange = 'removeLocked';

        // Assert exchange
        await channel.assertExchange(exchange, 'fanout', { durable: false });

        // Assert queue
        const { queue } = await channel.assertQueue('', { exclusive: true });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        // Bind queue
        await channel.bindQueue(queue, exchange, '');

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const data = (msg.content.toString());
                console.log('Received message:', data);
                const prob = await models.problems.findByPk(data);
                if (prob === null) {
                    console.error("Problem not found");//it should never came here
                } else {
                    await prob.destroy();
                }
                channel.ack(msg);
            }
        }, { noAck: false });
        console.log(`Waiting for messages in queue: ${queue}`);
    } catch (error) {
        console.error("Failed to consume messages:", error);
    }
}

const app = express();

newSub();
changeStatus();
remove();
removeLocked();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded( {extended: true }));

app.get("/getall", async (req,res,next)=>{
    models.problems.findAll()
    .then(problem => {
        res.status(200).json({result: problem});
    }).catch(err => {
        res.status(500).json({error:err});
    });
});

app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found'})
});



module.exports = app;