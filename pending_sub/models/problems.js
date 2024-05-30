const Sequelize = require('sequelize');
const zlib = require('zlib'); 

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('problems', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    problem_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    script: {
        type: DataTypes.TEXT('long'), 
        allowNull: false,
        set(value) {
            if (value == null) return;
            const compressed = zlib.deflateSync(value).toString('base64');
            this.setDataValue('script', compressed);
        },
        get() {
            const compressed = this.getDataValue('script');
            if (!compressed) return null;
            const buffer = Buffer.from(compressed, 'base64');
            const uncompressed = zlib.inflateSync(buffer).toString();
            return uncompressed;
        }
    }
  }, {
    sequelize,
    tableName: 'problems',
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