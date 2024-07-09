const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.FINISHED_DB, process.env.FINISHED_DB_USER, process.env.FINISHED_DB_PASS, {
    dialect: 'mysql',
    host: process.env.FINISHED_DB_HOST,
    port: process.env.FINISHED_DB_PORT
});

sequelize.authenticate()
.then(() => {
    console.log("Success connecting to finished database!"); 
})
.catch(err => {
    console.error(`Unable to connect to the finished database user ${process.env.FINISHED_DB_USER}`, err);
})

module.exports = sequelize;
