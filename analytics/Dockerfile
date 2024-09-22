# Step 1: Use a Node.js base image
FROM node:18

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Step 4: Install the dependencies
RUN npm install


# Step 6: Expose necessary ports (if any; for example, if analytics.js exposes a REST API)
EXPOSE 3080 

# Step 7: Start the application
CMD ["node", "index.js"]  # If "index.js" starts both RabbitMQ consumer and MongoDB connection

# Optional: If you need to run `analytics.js` separately, you can modify the CMD or create a docker-compose file to run multiple services.
