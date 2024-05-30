const express = require("express");
const cors = require("cors");
const sequelize = require("./connect_db");
var initModels = require("./models/init-models");
const amqp = require("amqplib");
// sequelize.sync({ force: true });   

var models = initModels(sequelize);

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