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

const app = express();

finishedSub();

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

// // Delete Finished Submission
// app.delete("/submission/:id", async (req, res) => {
//     const id = req.params.id;
//     try {
//         const result = await models.finished_problems.destroy({ where: { _id: id } });
//         if (result) {
//             res.status(200).json({ message: 'Submission deleted successfully' });
//         } else {
//             res.status(404).json({ error: 'Submission not found' });
//         }
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

app.get("/getall", async (req, res, next) => {
    models.finished_problems.findAll()
    .then(problems => {
        res.status(200).json({ result: problems });
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

module.exports = app;
