const Sequelize = require('sequelize');
// require('custom-env').env('localhost')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS, {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
});

sequelize.authenticate()
.then(() => {
    console.log("Success connecting to database!"); 
    // await sequelize.sync({ force: true });   
})
.catch(err => {
    console.error(`Unable to connect to the database user ${process.env.DB_USER}`, err);
})

module.exports = sequelize;