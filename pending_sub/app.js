const express = require("express");
const cors = require("cors");
const sequelize = require("./connect_db");
var initModels = require("./models/init-models");
const amqp = require("amqplib");
const problems = require("./models/problems");
//sequelize.sync({ force: true });   

var models = initModels(sequelize);

async function demo() {
    try {
        const prob = await models.problems.create({
            user_id: 1, 
            username: "Max",
            problem_name: "Works?",
            script: "print('Bark')" 
        });
        console.log(prob);
    } catch (error) {
        console.error("Failed to create problem:", error);
    }
}

demo();

async function newSub() {
    try {
        const connection = await amqp.connect("amqp://user:1234@localhost");
        const channel = await connection.createChannel();
        const queue = "new_submission"; //new_submission sends msg {user_id:"", username:"", problem_name:"",script:""}

        await channel.assertQueue(queue, { durable: false });

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                console.log('Received message:', data);
                const prob = await models.problems.create({
                    user_id:data.user_id,
                    username:data.username,
                    status:true,
                    problem_name:data.problem_name,
                    script:data.script
                });
                console.log(prob)
                channel.ack(msg);
            }
        }, { noAck: false });
        console.log(`Waiting for messages in queue: ${queue}`);
    } catch (error) {
        console.error("Failed to consume messages:", error);
    }
}

const app = express();

async function createNewSubmission(submission) {
    try {
        // Σύνδεση με RabbitMQ
        const connection = await amqp.connect("amqp://user:1234@localhost");
        const channel = await connection.createChannel();
        const queue = "new_submission"; // Όνομα της ουράς

        // Δημιουργία ουράς αν δεν υπάρχει
        await channel.assertQueue(queue, { durable: false });

        // Δημιουργία μηνύματος
        const msg = JSON.stringify(submission);

        // Αποστολή μηνύματος στην ουρά
        channel.sendToQueue(queue, Buffer.from(msg));

        console.log(" [x] Sent %s", msg);

        // Κλείσιμο καναλιού και σύνδεσης
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error("Failed to send message:", error);
    }
}

// Παράδειγμα χρήσης
const submission = {
    user_id: 1,
    username: "Intefix",
    problem_name: "pub",
    script: "print('woof')"
};

createNewSubmission(submission);

newSub();


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