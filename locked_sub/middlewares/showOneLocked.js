const mongoose = require('mongoose');
const submissions = require('../dbSchema');

const showOneLocked = async (req, res, next) => {
    try {
        console.log('Got locked request');

        await mongoose.connect('mongodb://locked_db:27017');

        const { id } = req.params;

        const _id = id

        let locked;

        locked = await submissions.find({ _id : _id }).select('locations num_vehicles depot max_distance submission_name timestamp status extra_credits user_id username _id execution_time timestamp_end');

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

module.exports = showOneLocked;
