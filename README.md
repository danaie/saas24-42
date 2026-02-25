# solveMyProblem

**solveMyProblem** is a Software-as-a-Service (SaaS) web application designed to solve computationally intensive optimization problems.

The platform allows users to submit optimization problems that require significant computational resources and specialized solver software. Instead of purchasing expensive hardware or licenses, users consume computing resources on demand using a credit-based system.
 
This project was developed as part of the ECE NTUA "SAAS" course.


## System Architecture

The system follows a **microservices architecture** and runs entirely in Docker containers. 

## Prerequisites

- Docker
- Docker Compose

## To deploy
```bash
docker compose build
docker compose up -d
```
