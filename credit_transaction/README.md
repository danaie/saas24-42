# MICROSERVICE

## Credit Transaction

- Wait for a string message from a exchange ```new_user``` with the user_id of the new user and add it to the database with 0 credits.

- POST request ```/editCredits``` :

body 
```
{
	amount : +/- int
	user_id : string
}
```

Response Codes: 
- 200: Transaction Done
- 406: Not enough credits
- 400: No user with this id

returns
```
{
    credits_num: int,
    user_id: string,
    updatedAt: date,
    createdAt: date
}
```
ip adress:
- localhost:8002 (locally) 
- credit-transaction:8080 (from docker)