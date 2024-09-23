const express = require("express");
const cors = require("cors");
const Credit_pub = require("./credit_pub");
const sequelize = require("./connect_db");
var initModels = require("./models/init-models");
const amqp = require("amqplib");
// sequelize.sync({ force: true });
sequelize.sync(); 


const credits_pub = new Credit_pub;

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
                console.log(id);
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

new_user()
var models = initModels(sequelize);


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded( {extended: true }));


// app.post("/add_user", async(req,res,next)=> {
//     const {amount, id} = req.body;
//     const user = await models.credits.create({
//         id: id,
//         credits_num: amount
//     });
//     user.save()
//     .then( ()=>{
//     return res.json(user)});
// })

//EDIT CREDITS 
app.post("/edit_credits", async(req,res,next) => {

    const {amount, user_id} = req.body;

    try {
        const user = await models.credits.findByPk(user_id);
        if (!user) {
            return res.status(400).json({error:`No user ${user_id} in database`});
        }
        else {
            user.credits_num = parseInt(user.credits_num) + parseInt(amount);
            if(user.credits_num < 0){
            return res.status(406).json({error: "Not enough credits."}); //Not Enough Credits
            }
            else {
                 //update database 
                await credits_pub.publish_msg({
                    id: user.dataValues.user_id,
                    credits_num: user.dataValues.credits_num
                });
            user.save()
            .then(() => {
                res.status(200).json(user.dataValues); //Transaction Done
            })

            }
        }
    }
catch (error) {
    console.error("Error updating credits:", error);
    res.status(500).json({ error: "Internal Server Error" }); // 500 - Error
}
});

app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found'})
});



module.exports = app;