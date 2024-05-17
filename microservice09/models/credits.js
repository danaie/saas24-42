const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('credits', {
    id: {
      autoIncrement: true,
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    credits_num: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
  }, {
    sequelize,
    tableName: 'credits',
    timestamps: true,
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