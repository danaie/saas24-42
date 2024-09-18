const mongoose = require('mongoose')
const submissions = require('../dbSchema')

async function addLocked(msg) {
    await mongoose.connect('mongodb://locked_db:27017')

    let message = JSON.parse(msg)
    message.status = "Locked"
    const sub = await submissions.create(msg)
    console.log('Added the following submission in Locked Submissions')
    console.log(sub)
}


module.exports = addLocked