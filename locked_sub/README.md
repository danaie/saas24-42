# Locked Submissions Microservice

The **Locked Submissions Microservice** is responsible for storing and unlocking of submissions that need extra credits to unlock the answer in the application. When a request to unlock a locked submission is received the microservice checks if the user has sufficient credits for unlocking the answer and then it sends the submission to the **Unlock Pub/Sub**, that **Finished Submissions Microservice** is subscribed to.

### API Endpoint:
The microservice listens on port **4000** and accepts the following requests:

#### GET /user_locked/:user_id:
This request returns all the locked submission of a user with this user_id

#### GET /one_locked/:id
This request returns further informations for the submission with this id

#### GET /all_locked
This request returns all locked problems from every user

#### GET /unlock/:id
This request unlocks the submission with this id if the user has sufficient amount of credits
