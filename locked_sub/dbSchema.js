const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    Latitude: { type: Number, required: true },
    Longitude: { type: Number, required: true }
},{_id : false});

const submissionSchema = new mongoose.Schema({
    _id: { type: String },
    locations: [locationSchema],
    num_vehicles: { type: Number, required: true },
    depot: { type: Number, required: true },
    max_distance: { type: Number, required: true },
    user_id: { type: Number, required: true },
    username: { type: String, required: true },
    submission_name: { type: String, required: true },
    timestamp: { type: Date, required: true }, 
    status: { type: String, required: true },
    extra_credits: { type: Number, required: true },
    execution_time: { type: Number, required: true },
    timestamp_end: { type: Date, required: true },
    answer: { type: String, required: true }
});

// Export the model with the 'submissions' collection name
module.exports = mongoose.model("submissions", submissionSchema);
