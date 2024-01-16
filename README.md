# NeuroDiffHub App

## Prerequisites
### Install Docker 
Install `Docker Desktop`

#### Ensure Docker Memory
- To make sure we can run multiple container go to Docker>Preferences>Resources and in "Memory" make sure you have selected > 4GB

### Install VSCode  
Follow the [instructions](https://code.visualstudio.com/download) for your operating system.  
If you already have a preferred text editor, skip this step.  

### Clone the github repository
- Clone [this repository](https://github.com/odegym/neurodiffhub)

### Note for Development:
Run Database server, followed by API Server, and finally Front-end. 

## API Service - For Windows
-  `cd api-service`
- Run `docker-shell.bat`

To install a new python package use `pipenv install requests` from the docker shell

To run development api service run `uvicorn_server` from the docker shell

Test the API service by going to `http://0.0.0.0:9000/` or `http://localhost:9000/` on windows

## Hub Frontend
-  `cd hub-frontend`
- Start docker shell `sh ./docker-shell.sh`
For Windows run the bat file

- Start frontend `yarn start`, go to `http://0.0.0.0:3000/`
For windows try with npm start instead, and in the env.development file change 0.0.0.0 to localhost for running on localhost

## Database Server
-  `cd database-server`
- Start docker shell `sh ./docker-shell.sh`
For Windows run the bat file
- Check migration status: `dbmate status`

## Testing

- Start the API Service
- Start the Data Base Server
- Run this in the DB Server: `sh ./test/create-db.sh`
- In API Server:
- Run `pytest` for executing tests or `pytest -s` for running tests with Debug & Print Statements


#### Dbmate Commands

```sh
dbmate --help    # print usage help
dbmate new       # generate a new migration file
dbmate up        # create the database (if it does not already exist) and run any pending migrations
dbmate create    # create the database
dbmate drop      # drop the database
dbmate migrate   # run any pending migrations
dbmate rollback  # roll back the most recent migration
dbmate down      # alias for rollback
dbmate status    # show the status of all migrations (supports --exit-code and --quiet)
dbmate dump      # write the database schema.sql file
dbmate wait      # wait for the database server to become available
```
