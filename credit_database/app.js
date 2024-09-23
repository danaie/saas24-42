const express = require('express');
const cors = require("cors");
const amqp = require("amqplib");
const sequelize = require("./connect_db");
var initModels = require("./models/init-models");
var models = initModels(sequelize);
 // sequelize.sync({ force: true }); 
sequelize.sync(); 

async function new_user() {
    try {
        const connection = await amqp.connect(`amqp://rabbitmq`);
        const channel = await connection.createChannel();
        const exchange = 'new_user';

        // Assert exchange
        await channel.assertExchange(exchange, 'fanout', { durable: false });

        // Assert queue
        const { queue } = await channel.assertQueue('', { exclusive: true });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", exchange);

        // Bind queue
        await channel.bindQueue(queue, exchange, '');

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const id = (msg.content.toString());
                const user = await models.credits.create({
                user_id: id,
                credits_num: 0
                });
                await user.save();
                channel.ack(msg);
            }
        }, { noAck: false });
        console.log(`Waiting for messages in queue: ${queue}`);
    } catch (error) {
        console.error("Failed to consume messages:", error);
    }
}

async function updateCredits() {
    try {
        const connection = await amqp.connect(`amqp://rabbitmq`);
        const channel = await connection.createChannel();
        const queue = "update_credit"; //update_credits sends msg {id:"", credits_num:""}

        await channel.assertQueue(queue, { durable: false });

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                console.log('Received message:', data);
                const user = await models.credits.findByPk(data.id);
                user.credits_num = data.credits_num;
                await user.save();
                console.log(user.dataValues);
                channel.ack(msg);
            }
        }, { noAck: false });
        console.log(`Waiting for messages in queue: ${queue}`);
    } catch (error) {
        console.error("Failed to consume messages:", error);
    }
}

updateCredits();

new_user();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded( {extended: true }));

app.get('/get_credits',async (req,res,next) =>{
    const id = req.body.user_id;
    models.credits.findByPk(id)
    .then(credits =>{
        if (credits == null) 
            res.status(400).json({error:`No user with id ${id}`});
        else res.status(200).json(credits);
    }).catch(err=>{
        res.status(500).json({error:err});
    })
});


app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found'})
});

module.exports = app;