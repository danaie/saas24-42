var DataTypes = require("sequelize").DataTypes;
var _credits = require("./credits");


function initModels(sequelize) {
  var credits = _credits(sequelize, DataTypes);
  return {
    credits
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;