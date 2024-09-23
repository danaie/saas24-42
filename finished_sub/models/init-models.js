var DataTypes = require("sequelize").DataTypes;
var _finished_problems = require("./finished_problems");  // Adjust model name to finished_problems

function initModels(sequelize) {
    var finished_problems = _finished_problems(sequelize, DataTypes);
    return {
        finished_problems
    };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
