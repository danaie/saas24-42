const express = require("express");
const cors = require("cors");
const Credit_pub = require("./credit_pub");
const sequelize = require("./connect_db");
var initModels = require("./models/init-models");
const amqp = require("amqplib");
// sequelize.sync({ force: true });
sequelize.sync(); 


const credits_pub = new Credit_pub;

var models = initModels(sequelize);

// async function removeCredits() {
//     try {
//         const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}`);
//         const channel = await connection.createChannel();
//         const queue = "remove_credit"; //remove_credits sends msg {id:"", credits:""}

//         await channel.assertQueue(queue, { durable: false });

//         channel.consume(queue, async (msg) => {
//             if (msg !== null) {
//                 const data = JSON.parse(msg.content.toString());
//                 console.log('Received message:', data);
//                 const user = await models.credits.findByPk(data.id);
//                 if (user !== null) {
//                     await user.decrement('credits_num', { by : data.credits});
//                     await user.reload();
//                     console.log(user.dataValues);
//                     await credits_pub.publish_msg({
//                         id :user.dataValues.id,
//                         credits_num :user.dataValues.credits_num
//                     });
//                 }
//                 channel.ack(msg);
//             }
//         }, { noAck: false });
//         console.log(`Waiting for messages in queue: ${queue}`);
//     } catch (error) {
//         console.error("Failed to consume messages:", error);
//     }
// }

// removeCredits();
// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded( {extended: true }));

// app.post("/add_credits/:user_id", async(req,res,next) => {
//     const id = parseInt(req.params.user_id,10);
//     const added_credits = req.body.added_credits;
//     const [user, created] = await models.credits.findOrCreate({
//         where: { id: id},
//         defaults: {
//             credits_num :parseInt(added_credits, 10)
//         },
//     });
//     if (!created) {
//         await user.increment('credits_num', { by : added_credits});
//         await user.reload();
//     }
//     console.log(user.dataValues);
//     await credits_pub.publish_msg({
//         id :user.dataValues.id,
//         credits_num :user.dataValues.credits_num
//     });
//     res.status(200).json(user.dataValues);
// });

// app.use((req, res, next) => {
//     res.status(404).json({ error: 'Endpoint not found'})
// });


// //Needed for port? 
// const PORT = process.env.PORT || 1000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });




const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded( {extended: true }));


//EDIT CREDITS 
app.post("/edit_credits", async(req,res,next) => {

    const {amount, user_id} = req.body;

    try {
        
        const [user, created] = await models.credits.findOrCreate({
            where: { id: user_id },
            defaults: {
                credits_num: 0 
            }
        });

        const newCredits = user.credits_num + amount;

        if(newCredits < 0){
            return res.status(406).json({error: "Not enough credits."}); //Not Enough Credits
        }

        if(!created){
            await user.increment('credits_num', {by: amount}); 
            await user.reload(); //Update Credits
        }

    console.log(user.dataValues);

    //pub-sub to database? 
    await credits_pub.publish_msg({
        id: user.dataValues.id,
        credits_num: user.dataValues.credits_num
    });
    
    
    res.status(200).json(user.dataValues); //Transaction Done
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