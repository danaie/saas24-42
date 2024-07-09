const express = require("express");
const cors = require("cors");
const sequelize = require("./connect_db");
const amqp = require("amqplib");
const FinishedProblems = require("./models/finished_problems");

async function finishedSub() {
    try {
        const connection = await amqp.connect("amqp://user:1234@localhost");
        const channel = await connection.createChannel();
        const queue = "finished_submission";

        await channel.assertQueue(queue, { durable: false });

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                console.log('Received message:', data);
                const prob = await FinishedProblems.create({
                    User_Id: data.user_id,
                    Username: data.username,
                    Problem_Name: data.problem_name,
                    Script: data.script,
                    Result: data.result,  // Assuming result is a buffer/file
                    Runtime: data.runtime,
                    Submission_Time: new Date(),
                    Result_Time: new Date()
                });
                console.log(prob);
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
        const submission = await FinishedProblems.findOne({ where: { Problem_Id: id } });
        if (submission) {
            res.status(200).json({ submission });
        } else {
            res.status(404).json({ error: 'Submission not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Finished Submission
app.delete("/submission/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await FinishedProblems.destroy({ where: { Problem_Id: id } });
        if (result) {
            res.status(200).json({ message: 'Submission deleted successfully' });
        } else {
            res.status(404).json({ error: 'Submission not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/getall", async (req, res, next) => {
    FinishedProblems.findAll()
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
