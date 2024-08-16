const express = require("express");
const cors = require("cors");
const sequelize = require("./connect_db");
var initModels = require("./models/init-models");
const amqp = require("amqplib");
const problems = require("./models/problems");
// sequelize.sync({ force: true });
sequelize.sync(); 


var models = initModels(sequelize);

async function newSub() {
    try {
        const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}`);
        const channel = await connection.createChannel();
        const queue = "new_submission"; //new_submission sends msg {user_id:"", username:"", problem_name:"",script:"", problem_id:""}

        await channel.assertQueue(queue, { durable: false });

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                console.log('Received message:', data);
                const prob = await models.problems.create({
                    id:data.problem_id,
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

async function changeStatus() {
    try {
        const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}`);
        const channel = await connection.createChannel();
        const queue = "running_submission"; //running_sudmission sends msg {problem_id:""}

        await channel.assertQueue(queue, { durable: false });

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                console.log('Received message:', data);
                const prob = await models.problems.findByPk(data.problem_id);
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
        const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}`);
        const channel = await connection.createChannel();
        const queue = "remove_pending"; //remove sends msg {problem_id:""}

        await channel.assertQueue(queue, { durable: false });

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                console.log('Received message:', data);
                const prob = await models.problems.findByPk(data.problem_id);
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