const sequelize = require("../utils/connect_db");
var initModels = require("../models/init-models");

var models = initModels(sequelize);
exports.getCredits = (req, res, next) => {
    const id = req.params.user_id
    models.users.findByPk(id)
    .then(credits =>{
        if (credits == null) 
            res.status(400).json({error:`No user with id ${id}`});
        else res.status(200).json({result:credits});
    }).catch(err=>{
        res.status(500).json({error:err});
    })
}