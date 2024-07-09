const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS, {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
});

sequelize.authenticate()
.then(() => {
    console.log("Success connecting to finished database!"); 
})
.catch(err => {
    console.error(`Unable to connect to the finished database user ${process.env.DB_USER}`, err);
})

module.exports = sequelize;




