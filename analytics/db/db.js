// /db/db.js
const mongoose = require('mongoose');

// Connect to MongoDB
async function connectToDB() {
  try {
    await mongoose.connect('mongodb://analytics_db:27017'); // Remove deprecated options
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}


// Define the submission schema
const submissionSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Using the provided unique ID as the MongoDB _id
  user_id: { type: Number, required: true },
  username: { type: String, required: true },
  submission_name: { type: String, required: true },
  timestamp: { type: String, required: true },
  timestamp_end: { type: String, default: '-1' }, // New field for ending timestamp
  status: { type: String, required: true, enum: ['pending', 'locked', 'finished','deleted'] }, // Status field
  extra_credits: { type: Number, required: true, default: -1 },
  execution_time: { type: Number, required: true, default: -1 },
});

// Create the Submission model
const Submission = mongoose.model('Submission', submissionSchema);

// Function to store or update data in MongoDB
async function storeOrUpdateInDB(data) {
  try {
    // Prepare the data to be stored or updated
    const submissionData = {
      user_id: data.user_id,
      username: data.username,
      submission_name: data.submission_name,
      timestamp: data.timestamp,
      timestamp_end: data.timestamp_end ? data.timestamp_end : null,
      status: data.status,
      extra_credits: data.extra_credits!== undefined ? data.extra_credits : -1,
      execution_time: data.execution_time !== undefined ? data.execution_time : -1,
    };

    // Check if the document with the given _id exists
    const existingSubmission = await Submission.findById(data._id);

    if (existingSubmission) {
      // If the entry exists, update it with new values
      Object.assign(existingSubmission, submissionData);

      // Save the updated document
      await existingSubmission.save();
      console.log(`Submission with _id ${data._id} updated in MongoDB:`, existingSubmission);
    } else {
      // If the entry does not exist, create a new one
      const newSubmission = new Submission({
        _id: data._id,  // Use the unique ID from the incoming data
        user_id: data.user_id,
        username: data.username,
        submission_name: data.submission_name,
        timestamp: data.timestamp,
        timestamp_end: data.timestamp_end ? data.timestamp_end : null,
        status: data.status,
        extra_credits: data.extra_credits!== undefined ? data.extra_credits : -1,
        execution_time: data.execution_time !== undefined ? data.execution_time : -1,
      });

      // Save the new submission to MongoDB
      await newSubmission.save();
      console.log('New submission saved to MongoDB:', newSubmission);
    }
  } catch (error) {
    console.error('Error saving or updating MongoDB entry:', error);
  }
}

// Export the connect function and storeOrUpdateInDB function
module.exports = {
  connectToDB,
  storeOrUpdateInDB,
  Submission,
};