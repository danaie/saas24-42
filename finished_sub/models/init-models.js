var DataTypes = require("sequelize").DataTypes;
var _finished = require("./finished_problems");


function initModels(sequelize) {
  var finished_problems = _finished(sequelize, DataTypes);
  return {
    finished_problems
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;