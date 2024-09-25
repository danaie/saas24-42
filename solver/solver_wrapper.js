const amqp = require('amqplib');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
//const finished_problems = require('../finished_sub/models/finished_problems');

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
    const locked_exchange = 'lockedPubSub';
    const unlocked_exchange = 'finished_submission';

    channel.assertExchange(locked_exchange, 'fanout', {
      durable: false
    });

    channel.assertExchange(unlocked_exchange, 'fanout', {
      durable: false
    });

    // handle message sending
    await channel.assertQueue(queue_out, {
      durable: false
    });
    const freshMessage = "Fresh"
    channel.sendToQueue(queue_out, Buffer.from(freshMessage));
      console.log(" [x] Sent %s", freshMessage);

    
    await channel.assertQueue(queue, { durable: true });
    
    console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

    // Start listening for messages
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          const messageContent = JSON.parse(msg.content.toString());
          
          const result = await runPythonSolver(messageContent);
    
          messageContent.answer = result.answer;
          messageContent.execution_time = result.executionTime;
          messageContent.extra_credits = result.extra_credits;
          messageContent.timestamp_end = result.timestamp_end;
    
          console.log('Updated message:', messageContent);
    
          if (result.extra_credits === 0) {
            console.log("Sent to finished queue");
            channel.publish(unlocked_exchange, '', Buffer.from(JSON.stringify(messageContent)));
          } else {
            console.log("Sent to locked queue");
            channel.publish(locked_exchange, '', Buffer.from(JSON.stringify(messageContent)));
          }
          
          channel.ack(msg);
          channel.sendToQueue(queue_out, Buffer.from(mesg_send));
          console.log(" [x] Sent %s", mesg_send);
        } catch (error) {
          console.error('Error processing message:', error);
          channel.nack(msg); // Negative ack to requeue the message for later processing
        }
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
        let result = Math.floor((executionTime - 60) / 60);
        const timestampEnd = new Date().toISOString(); // Get the current timestamp in ISO format
        if (result < 0) {
            result = 0;
        }
        const extra_credits = result*50;

        resolve({
          answer: stdout.trim(),
          executionTime: executionTime,
          extra_credits: extra_credits,
          timestamp_end: timestampEnd
        });
        
        // Clean up temporary locations file
        fs.unlinkSync(locationsFilePath);
      }
    });
  });
}

// Start the RabbitMQ listener
startRabbitMQ();
