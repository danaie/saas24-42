# NTUA ECE SAAS 2024 PROJECT
  
## TEAM (42)
  
  
Περιγραφή - οδηγίες
  
Περιέχονται φάκελοι για 15 microservices. Ο αριθμός είναι εντελώς ενδεικτικός. Δημιουργήστε ακριβώς όσα απαιτούνται από τη λύση σας.

### Credit Database: 
- Wait for a json message from a queue ```update_credit```
```
    {
        id: ,
        credit_num:
    }
```
and replace the credits with the new number

- GET request ```/get_credidts/:user_id```  returns
```
{
    id: ,
    credits_num: ,
    createdAt: "2024-09-16T17:48:52.000Z",
    updatedAt: "2024-09-16T17:48:52.000Z"
}
```

### Credit Transaction
- Wait for a json message from queue ```remove_credit```
```
{
    id: ,
    credits: 
}
```
and subtrack the number from the current
- POST request ```/add_credits/:user_id``` 
takes a json in body
```
{
    added_credits: 
}
```
returns
```
{
    credits_num: ,
    id: ,
    updatedAt: "2024-09-16T17:48:52.665Z",
    createdAt: "2024-09-16T17:48:52.665Z"
}
```

### Pending-Running submissions 
- Wait for a json message from queue ```new_submission```
```
{
    user_id: , 
    username: , 
    problem_name: ,
    script: , 
    problem_id: 
}
```
- Wait for json message from queue ```running_submission```
```
{
    problem_id: 
}
```
- Wait for json message from queue ```remove_pending```
```
{
    problem_id:
}
```
- GET request ```/getall``` returns


