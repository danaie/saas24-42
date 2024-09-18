const mongoose = require('mongoose')
const submissions = require('../dbSchema')

async function removeLocked(msg) {
    console.log('Got remove request ', msg)
    await mongoose.connect('mongodb://locked_db:27017')
    const del = await submissions.findOneAndDelete({_id : msg})
}


module.exports = removeLocked