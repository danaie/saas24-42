# Add Submission Microservice

The **Add Submission Microservice** is responsible for handling the creation of new submissions in the application. When it receives a new submission, it publishes the data to the **New Submission Pub/Sub** system, to which the **Solver Queue** and the **Running/Pending Submission Microservices** are subscribed.

### API Endpoint:
The microservice listens on port **3000** and accepts POST requests at the following URL:
http://localhost:3000/


### Request Body:

The POST request must contain the following JSON structure:
```json
{
  "location": [ 
    { 
      "Latitude": Number, 
      "Longitude": Number 
    } 
  ],
  "num_vehicles": Number,
  "depot": Number,
  "max_distance": Number,
  "user_id": Number,
  "username": String,
  "submission_name": String,
  "timestamp": Date
}
```
Field Descriptions:

* location: An array of JSON objects, each containing Latitude and Longitude attributes. This defines the locations related to the submission.
* num_vehicles: Number of vehicles involved in the submission.
* depot: Numeric identifier for the depot associated with the submission.
* max_distance: Maximum allowable distance for the submission's calculations.
* user_id: The numeric ID of the user making the submission.
* username: The username of the person making the submission.
* submission_name: A string representing the name or title of the submission.
* timestamp: The timestamp (in date format) when the submission is created.


