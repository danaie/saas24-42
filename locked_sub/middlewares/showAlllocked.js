const mongoose = require('mongoose');
const submissions = require('../dbSchema');

const showLocked = async (req, res, next) => {
    try {
        console.log('Got locked request');

        // Connect to MongoDB (Consider reusing the connection in a real app)
        await mongoose.connect('mongodb://locked_db:27017');

        let locked;
        locked = await submissions.find().select('username submission_name timestamp status extra_credits _id');

        console.log('=============================');
        console.log('Locked Submissions');
        console.log('Remaining IDs:', locked.length);
        console.log(locked);
        console.log('=============================');

        // Send the locked submissions as a response
        res.status(200).json(locked);
    } catch (error) {
        // Handle any errors that occurred during the operation
        console.error('Error fetching locked submissions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch locked submissions',
            error: error.message,
        });
    }
};

module.exports = showLocked;
