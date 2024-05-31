var DataTypes = require("sequelize").DataTypes;
var _problems = require("./problems");


function initModels(sequelize) {
  var problems = _problems(sequelize, DataTypes);
  return {
    problems
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;