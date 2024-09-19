const { timeStamp } = require('console');
const Sequelize = require('sequelize');
const zlib = require('zlib'); 

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('problems', {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    status: { //pending->true, running->false
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        get() {
            return this.getDataValue('status') ? 'pending' : 'running';
          }
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
    timeStamp : {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'problemsdepot',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      }      
    ]
  });
};