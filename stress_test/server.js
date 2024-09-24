const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 4040; // Changed to port 4040

// Enable CORS
app.use(cors());

// Endpoint to get queue size
app.get('/queuenum', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:4080/queuenum');
        const queueSize = parseInt(response.data.match(/\d+/)[0]); // Extract number from response
        res.json({ queueSize });
    } catch (error) {
        console.error('Error fetching queue size:', error);
        res.status(500).json({ error: 'Failed to fetch queue size' });
    }
});

// Serve the HTML file for the graph
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve the HTML file from the same directory
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
