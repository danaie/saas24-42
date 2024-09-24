# MICROSERVICE

## Credit Database

- Wait for a string message from a exchange ```new_user``` with the user_id of the new user and add it to the database with 0 credits.

- Wait for a json message from a queue ```update_credit```
```
    {
        id: string,
        credit_num: int
    }
```
and replace the credits with the new number

- GET request ```/get_credidts``` with body 
```
{
    id: string
} 
```
and returns
```
{
    id: string,
    credits_num: int,
    createdAt: date,
    updatedAt: date"
}
```

ip adress:
- localhost:8001 (locally) 
- credit-database:8080 (from docker)
