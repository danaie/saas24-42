const mongoose = require('mongoose');
const submissions = require('../dbSchema');

const showLocked = async (req, res, next) => {
    try {
        console.log('Got locked request');

        await mongoose.connect('mongodb://locked_db:27017');

        const { user_id } = req.params;

        let locked;
        locked = await submissions.find({ user_id : user_id }).select('submission_name timestamp status extra_credits _id');

        console.log('=============================');
        console.log('Locked Submissions');
        console.log('Remaining IDs:', locked.length);
        console.log(locked);
        console.log('=============================');

        res.status(200).json(locked);
    } catch (error) {
        console.error('Error fetching locked submissions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch locked submissions',
            error: error.message,
        });
    }
};

module.exports = showLocked;
