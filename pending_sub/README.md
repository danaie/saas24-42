# MICROSERVICE

## Pending Running Submissions

- Wait for json message from exchange ```NewSubPubSub``` 
```
{
    _id: string,
    user_id: string,
    username: string, 
    submission_name: string,
    locations: json,
    num_vehicles: int,
    depot: int,
    max_distance: int,
    timestamp: date
}
```
and adds the new problem with pending status and sends the problem to the ```analytics microservice``` .

- Wait for string message from queue ```running``` with the problem_id and change the status from pending to running.

- Wait for string message fron exchange ```remove``` with the problem_id it refunds for the problem and delete it from the database.

- Wait for string message from exhange ```removedLocked``` with the problem id and delete it from database

- GET request ```/get/:user_id``` returns 
```
{
    result : list of json with the problems of the user
}
```

- GET request ```/getall``` returns 
```
{
    result : list of json with all the problems
}
```

ip adress:
- localhost:5000 (locally) 
- pendrun:8080 (from docker)