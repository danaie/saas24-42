const express = require("express");
const cors = require("cors");
const sequelize = require("./connect_db");
const amqp = require("amqplib");
var initModels = require("./models/init-models");
const Analytics_pub = require("./analytics_pub")

const analytics_pub = new Analytics_pub;

sequelize.sync({ force: true });  
// sequelize.sync(); 

var models = initModels(sequelize);

async function finishedSub() {
    try {
        const connection = await amqp.connect(`amqp://rabbitmq`);
        const channel = await connection.createChannel();
        const queue = "finished_submission";

        await channel.assertQueue(queue, { durable: false });

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                const str = data.answer
                const sizeInBytes = Buffer.byteLength(str, 'utf8');
                console.log(`The string is ${sizeInBytes} bytes in memory.`);
                //console.log('Received message:', data);
                const anwser_len = data.answer.length
                console.log('Anwser lenght:', anwser_len)
                const prob = await models.finished_problems.create({
                        _id: data._id,
                        user_id: data.user_id,
                        username: data.username,
                        status: "finished",
                        submission_name: data.submission_name,
                        locations: data.locations,
                        num_vehicles: data.num_vehicles,
                        depot: data.depot,
                        max_distance: data.max_distance,
                        timestamp: data.timestamp,
                        extra_credits: data.extra_credits,
                        execution_time: data.execution_time,
                        timestamp_end: data.timestamp_end,
                        answer: data.answer
                    });
                //console.log(prob);
                await analytics_pub.publish_msg(prob);
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
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", exchange);

        // Bind queue to the exchange
        await channel.bindQueue(queue, exchange, '');

        // Consume messages
        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                try {
                    const data = msg.content.toString();
                    console.log('Received message:', data);

                    // Find the problem by primary key (data is the problem ID)
                    const prob = await models.finished_problems.findByPk(data);
                    if (prob === null) {
                        console.error("Problem not found");
                    } else {
                        await prob.destroy();
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
        console.log(`Waiting for messages in queue: ${exchange}`);
    } catch (error) {
        console.error("Failed to consume messages:", error);
    }
}


const app = express();

finishedSub();
remove();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View Submission Details
app.get("/submission/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const submission = await models.finished_problems.findByPk(id);
        if (submission) {
            res.status(200).json({ submission });
        } else {
            res.status(404).json({ error: 'Submission not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get("/getall", async (req, res, next) => {
    models.finished_problems.findAll()
    .then(problems => {
        res.status(200).json({ result: problems });
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

app.get("/get/:user_id",async (req,res,next) => {
    models.finished_problems.findAll({
        where :{user_id : req.params.user_id}
    })
    .then(problem => {
        res.status(200).json({result:problem});
    }).catch(err => {
        res.status(500).json({error:err});
    })
})


app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

module.exports = app;
