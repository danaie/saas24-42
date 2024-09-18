const mongoose = require('mongoose')
const submissions = require('../dbSchema')

async function addQ(msg) {
    await mongoose.connect('mongodb://solverq_db:27017')
    const sub = await submissions.create(msg)
    //const test = await submissions.findOne({username : "Manos"})
    console.log(sub)
    const all = await submissions.find().select('_id')
    console.log('Current number of Submissions in queue is', all.length)
}


module.exports = addQ