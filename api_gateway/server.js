const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

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

app.listen(8000, () => {
  console.log('API Gateway running on port 8000');
});
