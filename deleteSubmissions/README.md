# Delete Submissions Microservice

The **Delete Submissions Microservice** is responsible for handling the removal of submissions in the application. When it receives a request for a deletion, it publishes the data to the **Delete Pub/Sub** system, to which the **Solver Queue**, the **Running/Pending Submission Microservices**, the **Locked Submissions Microservice** and the "Finished Submissions Microservice" are subscribed.

### API Endpoint:
The microservice listens on port **8000** and accepts POST requests at the following URL:
http://localhost:8000/remove

### Request Body:

The POST request must contain the following JSON structure:
```json
{
  "id": String 
}
```
Field Descriptions:

* id : The id of the submission to be deleted


