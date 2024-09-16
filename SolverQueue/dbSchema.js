const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    Latitude: { type: Number, required: true },
    Longitude: { type: Number, required: true }
});

const submissionSchema = new mongoose.Schema({
    _id: { type: String }, 
    locations: [locationSchema],
    num_vehicles: { type: Number, required: true },
    depot: { type: Number, required: true },
    max_distance: { type: Number, required: true },
    user_id: { type: Number, required: true },
    username: { type: String, required: true },
    submission_name: { type: String, required: true },
    timestamp: { type: String, required: true }
});

module.exports = mongoose.model("submissions", submissionSchema);
