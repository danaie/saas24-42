const express = require('express');
require('dotenv').config(); // Load environment variables
const {connectDB} = require('./connect_db'); // MongoDB connection
const router = express.Router();
const { loginWithGoogle } = require('./controllers/authController');
const cors = require('cors');

const app = express();
console.log("Hello World!");

// Connect to MongoDB
connectDB();
app.use(express.json());

// Enable CORS to allow requests from the frontend
app.use(cors());

// Routes
app.post('/', loginWithGoogle);

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  })

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
const PORT =  8111;  //process.env.PORT ||
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});









/*router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });*/