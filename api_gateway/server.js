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
    const response = await axios.post('http://localhost:8002/add_credits/' + user_id, {
      added_credits: amount,
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error in adding credits:', error.message);
    res.status(500).json({ message: 'Failed to process credit addition: ' + error.message });
  }
});

app.get('/api/getCredits/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const response = await axios.get(`http://localhost:8001/get_credits/${user_id}`); // Call to credit_database
    res.json(response.data);
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


app.listen(8000, () => {

  console.log('API Gateway running on port 8000');
});

