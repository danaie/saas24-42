const { DataTypes } = require('sequelize');
const sequelize = require('../connect_db');

const FinishedProblems = sequelize.define('FinishedProblems', {
    Problem_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    User_Id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Result: {
        type: DataTypes.BLOB('long'), // Assuming 'Result' is a file, using BLOB for binary data
        allowNull: false
    },
    Runtime: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
}, {
    tableName: 'FinishedProblems',
    timestamps: false
});

module.exports = FinishedProblems;
