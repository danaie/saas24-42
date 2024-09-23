// /index.js
const amqp = require('amqplib');
const { connectToDB, storeOrUpdateInDB } = require('./db/db'); // Import the db functions
const express = require('express');
const analyticsRouter = require('./analytics'); // Import the analytics route

const app = express();
const port = 3080;

// RabbitMQ connection settings
const queue = 'analytics_queue'; // Replace with your actual queue name

async function startRabbitMQ() {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect('amqp://rabbitmq'); // Replace with your RabbitMQ URL
    const channel = await connection.createChannel();

    // Ensure queue exists
    await channel.assertQueue(queue, { durable: true });

    console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

    // Start consuming messages
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const messageContent = JSON.parse(msg.content.toString());
        console.log('Received message:', messageContent);

        // Store or update the entry in MongoDB
        await storeOrUpdateInDB(messageContent);

        // Acknowledge message
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Error in RabbitMQ setup:', error);
  }
}

// Function to start the RabbitMQ listener and the Express server
async function startService() {
  await connectToDB();  // Connect to MongoDB
  
  // Start RabbitMQ listener in the background
  startRabbitMQ();

  // Set up Express middleware
  app.use(express.json());

  // Set up the analytics route
  app.use('/analytics', analyticsRouter);

  // Handle invalid routes
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  // Start the Express server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

// Start both the RabbitMQ service and the Express server
startService();
