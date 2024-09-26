const express = require('express');
const axios = require('axios');
const cors = require('cors');
const multer = require('multer'); // Import multer
const app = express();
const fs = require('fs');
const path = require('path');

app.use(cors());
app.use(express.json());

// Set up multer for handling file uploads
const storage = multer.memoryStorage(); // Store the file in memory (you can also configure it to save to disk)
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('1084072222930-nnrj4ldk6o2euc0e9itf76g0irgjm3im.apps.googleusercontent.com');

app.post('/api/login', async (req, res) => {
  const { idToken } = req.body; // Extract ID token from the request body
  console.log(idToken);

  try {

    const backendResponse = await axios.post('http://google-auth:8111', {
      idToken // Send the ID token as part of the request body
    });

    console.log(backendResponse.data.user.googleId);
  

    // Here, you can implement your logic to find or create the user in your database
    // For example, check if the user already exists in your system
    // If not, create a new user entry

    res.status(200).json({
      message: 'User authenticated successfully',
      userId: backendResponse.data.user.googleId, // Use Google user ID or any other user information
      username: backendResponse.data.user.username,
      role: backendResponse.data.user.role
    });
  } catch (error) {
    console.error('Error verifying ID token:', error.message);
    res.status(401).json({ message: 'Failed to authenticate user: ' + error.message });
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

const FormData = require('form-data');

app.post('/api/submitProblem', async (req, res) => {
  try {
    const jsonData = req.body; // Directly access the JSON data

    // Send the parsed JSON to the microservice
    const response = await axios.post('http://newsub:3010/', jsonData, {
      headers: {
        'Content-Type': 'application/json',
      },
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
    //for testing reasons:
    //const { user_id } = 10000;
    const response = await axios.get(`http://lockedsub:4000/user_locked/${user_id}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching locked submissions:', error.message);
    res.status(502).json({ message: 'Failed to fetch locked submissions: ' + error.message });
  }
});

app.get('/api/get_pending/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    // Make a request to the microservice or database where the data is stored
    const response = await axios.get(`http://pendrunnew:8080/get/${user_id}`);
    // Respond with the data from the microservice
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ message: 'Failed to fetch data: ' + error.message });
  }
});

app.post('/api/delete_sub_pending', async (req, res) => {
  try {
    const { subId } = req.body;

    if (!subId) {
      return res.status(400).json({ message: 'Missing subId' });
    }

    // Send the delete request to the deletesub microservice
    const response = await axios.post('http://removesub:8000/remove', {
      id: subId
    });

    // Forward the response from deletesub microservice
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error deleting submission:', error.message);
    res.status(500).json({ message: 'Failed to delete submission: ' + error.message });
  }
});

// Unlock a submission
app.post('/api/unlock_submission', async (req, res) => {
  try {
    const { subId } = req.body;

    if (!subId) {
      return res.status(400).json({ message: 'Missing subId' });
    }

    // Send the unlock request to the lockedsub microservice
    const response = await axios.get(`http://lockedsub:4000/unlock/${subId}`);

    // Forward the response from the lockedsub microservice
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error unlocking submission:', error.message);
    res.status(500).json({ message: 'Failed to unlock submission: ' + error.message });
  }
});

// Fetch all finished submissions for a user
app.get('/api/get_finished/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    // Make a request to the finished_sub microservice
    const response = await axios.get('http://finished:8080/getall');

    // Filter results by user_id if necessary (in case the microservice doesn't)
    const finishedSubmissions = response.data.result.filter(submission => submission.user_id === user_id);

    // Respond with the filtered data
    res.status(200).json({ result: finishedSubmissions });
  } catch (error) {
    console.error('Error fetching finished submissions:', error.message);
    res.status(500).json({ message: 'Failed to fetch finished submissions: ' + error.message });
  }
});

// Get analytics for a specific user
app.get('/api/analytics/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    // Call the analytics microservice
    const response = await axios.get(`http://analytics:3080/analytics/${user_id}`);  // Microservice call

    // Forward the response from the analytics microservice
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error fetching analytics:', error.message);
    res.status(500).json({ message: 'Failed to fetch analytics: ' + error.message });
  }
});

app.listen(8042, () => {

  console.log('API Gateway running on port 8042');
});

