const mongoose = require('mongoose');
const submissions = require('../dbSchema');

const showLocked = async (req, res, next) => {
    try {
        console.log('Got locked request');

        // Connect to MongoDB (Consider reusing the connection in a real app)
        await mongoose.connect('mongodb://locked_db:27017');

        // Extract user_id from URL parameters
        const { user_id } = req.params;

        let locked;
        if (!user_id || user_id === "") {
            locked = await submissions.find().select('submission_name timestamp status unlockPrice _id');
        } else {
            // If user_id exists, fetch locked submissions for that specific user
            locked = await submissions.find({ user_id : user_id }).select('submission_name timestamp status unlockPrice _id');
        }

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
