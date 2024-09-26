const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    role: {
        type: String,
        required:  true
    }
  });

  const User = mongoose.model('User', userSchema);


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);  // Exit the process with a failure code
  }
};

module.exports = { connectDB, User };
