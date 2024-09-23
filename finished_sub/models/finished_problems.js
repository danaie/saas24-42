const { DataTypes } = require('sequelize');
const sequelize = require('../connect_db');

module.exports = function (sequelize,DataTypes){
    return sequelize.define('finished_problems', {
    _id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },
    user_id: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    status: { //pending->true, running->false
        type: DataTypes.STRING(255),
        defaultValue: "finished"
    },
    submission_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    locations: {
        type: DataTypes.JSON, 
        allowNull: false,
    },
    num_vehicles: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    depot: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    max_distance: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timestamp : {
      type: DataTypes.DATE,
      allowNull: false
    },
    extra_credits: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    execution_time: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    timestamp_end: {
        type: DataTypes.DATE,
        allowNull:false
    },
    answer: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'finished_problems',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "_id" },
        ]
      }      
    ]
  });
};