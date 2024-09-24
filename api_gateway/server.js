const express = require('express');
const axios = require('axios');
const cors = require('cors');
const multer = require('multer'); // Import multer
const app = express();

app.use(cors());
app.use(express.json());

// Set up multer for handling file uploads
const storage = multer.memoryStorage(); // Store the file in memory (you can also configure it to save to disk)
const upload = multer({ storage: storage }); // Initialize multer

app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const response = await axios.post('http://localhost:9876/signup', { name, email, password });
    res.json(response.data);
  } catch (error) {
    console.error('Error in signup:', error.message);
    res.status(500).json({ message: 'Failed to sign up: ' + error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await axios.post('http://localhost:9876/login', { email, password });
    res.json(response.data);
  } catch (error) {
    console.error('Error in login:', error.message);
    res.status(500).json({ message: 'Failed to log in: ' + error.message });
  }
});

// New Credit Transaction route
app.post('/api/addCredits', async (req, res) => {
  try {
    const { amount, user_id } = req.body;
    const response = await axios.post('http://credit-transaction:8080/edit_credits', { // Update endpoint
      amount: amount, // Change to match second route's expected body
      user_id: user_id,
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error in adding credits:', error.message);
    res.status(505).json({ message: 'Failed to process credit addition: ' + error.message });
  }
});

app.get('/api/getCredits/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    // Log to ensure user_id is correct
    console.log(`Fetching credits for user_id: ${user_id}`);

    const response = await axios.get(`http://credits-database:8080/get_credits`, {
      data: { user_id } // Send user_id as a query parameter
    });

    // Forward the relevant data from the credit database response
    res.json({
      user_id: response.data.user_id, // Assuming this is part of the response
      credits_num: response.data.credits_num // Adjust if needed
    });
  } catch (error) {
    console.error('Error in getting credits:', error.message);
    res.status(500).json({ message: 'Failed to get credits: ' + error.message });
  }
});


app.post('/api/submitProblem', upload.single('file'), async (req, res) => {
  try {
    const { model } = req.body;
    const file = req.file;

    // Construct the request for the pending submissions microservice
    const formData = new FormData();
    formData.append('model', model);
    formData.append('file', file.buffer, file.originalname);

    const response = await axios.post('http://localhost:8080/submit', formData, {
      headers: formData.getHeaders(),
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error in problem submission:', error.message);
    res.status(500).json({ message: 'Failed to submit problem: ' + error.message });
  }
});

app.get('/api/user_locked/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const response = await axios.get(`http://localhost:4000/user_locked/${user_id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching locked submissions:', error.message);
    res.status(500).json({ message: 'Failed to fetch locked submissions: ' + error.message });
  }
});

app.listen(8042, () => {

  console.log('API Gateway running on port 8042');
});

