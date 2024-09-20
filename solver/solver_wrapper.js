const amqp = require('amqplib');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// RabbitMQ connection settings
const queue = 'sendNew'; // Replace with your actual queue name

async function startRabbitMQ() {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect('amqp://rabbitmq'); // Replace with your RabbitM URLQ
    const channel = await connection.createChannel();
    
    // Ensure queue exists
    const queue_out = 'RequestNewPubSub';
    const mesg_send = 'Send new';

    // handle message sending
    channel.assertQueue(queue_out, {
      durable: false
    });

    channel.sendToQueue(queue_out, Buffer.from(mesg_send));
      console.log(" [x] Sent %s", mesg_send);

    
    await channel.assertQueue(queue, { durable: true });
    
    console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

    // Start listening for messages
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const messageContent = JSON.parse(msg.content.toString());

        // Call the Python solver
        const result = await runPythonSolver(messageContent);


        channel.sendToQueue(queue_out, Buffer.from(mesg_send));
        console.log(" [x] Sent %s", mesg_send);


        // Add the answer and execution_time to the original JSON
        messageContent.answer = result.answer;
        messageContent.execution_time = result.executionTime;

        // Log or send the modified message back to RabbitMQ or elsewhere
        console.log('Updated message:', messageContent);
        
        // Acknowledge message
        channel.ack(msg);
      }
    });

  } catch (err) {
    console.error('Error in RabbitMQ setup:', err);
  }
}

// Function to run the Python solver and measure execution time
async function runPythonSolver(data) {
  const startTime = Date.now();
  // Count the number of locations
  const numLocations = data.locations.length;
  // Create a temporary locations JSON file for the solver
  const locationsFilePath = path.join(__dirname, `locations_${numLocations}.json`);
  fs.writeFileSync(locationsFilePath, JSON.stringify({ locations: data.locations }, null, 2));

  // Prepare the command to run Python script
  const command = `python3 vrpSolver.py ${locationsFilePath} ${data.num_vehicles} ${data.depot} ${data.max_distance}`;
  
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing Python script: ${error.message}`);
      } else if (stderr) {
        reject(`Python script error: ${stderr}`);
      } else {
        const executionTime = (Date.now() - startTime) / 1000; // Convert to seconds
        resolve({
          answer: stdout.trim(),
          executionTime: executionTime
        });
        
        // Clean up temporary locations file
        fs.unlinkSync(locationsFilePath);
      }
    });
  });
}

// Start the RabbitMQ listener
startRabbitMQ();
