const mongoose = require('mongoose')
const submissions = require('../dbSchema')

const subsInQueue = async (req, res, next) => {
    await mongoose.connect('mongodb://solverq_db:27017')
    const subs = await submissions.find({})
    req.subsInQueue = subs.length;

    next()
}


module.exports = subsInQueue