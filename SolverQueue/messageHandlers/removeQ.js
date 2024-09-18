const mongoose = require('mongoose')
const submissions = require('../dbSchema')

async function removeQ(msg) {
    console.log('Got remove request ', msg)
    await mongoose.connect('mongodb://solverq_db:27017')
    const del = await submissions.findOneAndDelete({_id : msg})

    // if (del) {
    //     console.log('Successfully deleted:', del);
    // } else {
    //     console.log('No document found with that ID');
    // }

    const ids = await submissions.find().select('_id')
    console.log('=============================')
    console.log('Submission in Queue')
    console.log('Remaining IDs:', ids.length)
    console.log(ids)
    console.log('=============================')

    //console.log(del)
}


module.exports = removeQ