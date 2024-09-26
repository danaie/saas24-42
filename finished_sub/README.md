# MICROSERVICE

## Finished Submissions

- Await json message from exchange ```finished_submission``` with
```
{
  _id: string,
  user_id: string,
  username: string,
  submission_name: string,
  locations:json,
  num_vehicles: int,
  depot: int,
  max_distance: int,
  timestamp: date,
  extra_credits: int,
  execution_time: int
  timestamp_end: date,
  answer: string
}
```

- Wait for string message fron exchange ```remove``` with the problem_id and delete it from the database.

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

- GET request ```/submission/:id``` returns problem info


ip adress:
- localhost:5001 (locally) 
- finished:8080 (from docker)
