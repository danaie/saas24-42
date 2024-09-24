const mongoose = require('mongoose')
const submissions = require('../dbSchema')

const removeAll = async (req, res, next) => {
    await mongoose.connect('mongodb://solverq_db:27017')
    const del = await submissions.deleteMany({})

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

    next()
}


module.exports = removeAll