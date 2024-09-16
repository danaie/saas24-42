const mongoose = require('mongoose')
const submissions = require('../dbSchema')

async function addQ(msg) {
    console.log('Hello')
    await mongoose.connect('mongodb://solverq_db:27017')
    const sub = await submissions.create(msg)
    const test = await submissions.findOne({username : "Manos"})
    console.log(sub)
}


module.exports = addQ