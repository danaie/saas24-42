# 1. Base image with Node.js and Python installed
FROM node:18-slim

# 2. Install Python3, pip, and other necessary tools
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# 3. Set the working directory inside the container
WORKDIR /usr/src/app

# 4. Copy the package.json and package-lock.json (if available)
COPY package*.json solver_wrapper.js vrpSolver.py   ./

# 5. Install Node.js dependencies
RUN npm install

# 6. Create a virtual environment for Python
RUN python3 -m venv venv

# 7. Activate the virtual environment and install OR-Tools
RUN . venv/bin/activate && pip install ortools


# 9. Install any additional Python dependencies (if needed)
# You can add other required Python packages for the solver in this step.

# 10. Expose any port if needed (e.g., for RabbitMQ communication)
# EXPOSE 5672 # Example if using RabbitMQ's default port

# 11. Command to run your Node.js script with the virtual environment
CMD ["sh", "-c", ". venv/bin/activate && node solver_wrapper.js"]
