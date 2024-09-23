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
        console.log(newCredits);


        if(newCredits < 0){
            return res.status(406).json({error: "Not enough credits."}); //Not Enough Credits
        }

        if(!created){
            await user.increment('credits_num', {by: amount}); 
            await user.reload(); //Update Credits
        }

    console.log(user.dataValues);

    //update database t 
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