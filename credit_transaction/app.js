const express = require("express");
const cors = require("cors");
const Credit_pub = require("./credit_pub");
const sequelize = require("./connect_db");
var initModels = require("./models/init-models");
const amqp = require("amqplib");

const credits_pub = new Credit_pub;

var models = initModels(sequelize);

async function removeCredits() {
    try {
        const connection = await amqp.connect("amqp://user:1234@localhost");
        const channel = await connection.createChannel();
        const queue = "remove_credit"; //remove_credits sends msg {id:"", credits:""}

        await channel.assertQueue(queue, { durable: false });

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                console.log('Received message:', data);
                const user = await models.credits.findByPk(data.id);
                if (user !== null) {
                    await user.decrement('credits_num', { by : data.credits});
                    await user.reload();
                    console.log(user.dataValues);
                    await credits_pub.publish_msg({
                        id :user.dataValues.id,
                        credits_num :user.dataValues.credits_num
                    });
                }
                channel.ack(msg);
            }
        }, { noAck: false });
        console.log(`Waiting for messages in queue: ${queue}`);
    } catch (error) {
        console.error("Failed to consume messages:", error);
    }
}

removeCredits();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded( {extended: true }));

app.post("/add_credits/:user_id", async(req,res,next) => {
    const id = req.params.user_id;
    const added_credits = req.body.added_credits;
    const [user, created] = await models.credits.findOrCreate({
        where: { id: id},
        defaults: {
            credits_num :parseInt(added_credits, 10)
        },
    });
    if (!created) {
        await user.increment('credits_num', { by : added_credits});
        await user.reload();
    }
    console.log(user.dataValues);
    await credits_pub.publish_msg({
        id :user.dataValues.id,
        credits_num :user.dataValues.credits_num
    });
    res.status(200).json(user.dataValues);
});

app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found'})
});


module.exports = app;