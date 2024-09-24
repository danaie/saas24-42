# Solver Queue Microservice

The **Solver Queue Microservice** is responsible for storing and scheduling pending submissions to the solver. **Solver Queue Microservice** schedules submission with FIFO rule. When the **Solver Microservice** is ready for solving a new submission it sends a message to the **Solver Queue Microservice** via the **Request New Pub/Sub**. Then the **Solver Queue Microservice** sends the oldest submission, due to the FIFO scheduling, to the **Solver Microservice** via the **Send New Pub/Sub** and sends a message to the **Pending/Running Submissions** via the **Running Submissions Pub/Sub** to update the status of this submission from pending to running. This microservice also has the two following requests for easier management.  

### API Endpoint:
The microservice listens on port **4080** and accepts the following requests:

#### GET /remove_all:
Flashes the queue

#### GET /queuenum
This request returns the amount of pending submission that wait in the queue.
