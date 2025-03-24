# Setup and Run full System

## Beluga Test Setup

The Beluga test setup only includes a domain dependent planner for the competition
JSON encoding.

## Docker

`beluga_test` contains a docker compose and two environments. 
You must define the following parameters:

`docker-compose.yml`:

Replace `<absolute bath to local folder>` with absolute paths to two **different** 
folders on your home system. These folders are used by the back-end and the 
database to store the uploaded data.

`backend.env`:

- `JWT_KEY`: a random string that is used to generate the login tokens to authenticate 
    users
- `SERVICE_KEY`: a random string that is used to authenticate any registered 
    services, e.g. planner 

**Attention**: `SERVICE_KEY` in ``backend.env` and `planner.env` must match.


`planner.env`:

- `API_KEY`: a random string that is used to authenticate a request from the 
    back-end to a service
- `SERVICE_KEY`: a random string that is used to authenticate any registered 
    services, e.g. planner 

**Attention**: If you register a new service in the web interface, then 
requested API Key must and the `API_KEY` defined in the service environment 
must match.

## Setup on MacOS

On MacOS network mode `host` is not supported. Therefore, you need a few changes to make the docker-compose work.

1. Remove all the `network_mode: "host"` lines in the `docker-compose.yml` file.
2. In every `.env` file change the `MONGO_DB` value to `MONGO_DB=mongodb://mongo:27017/<whatever_you_want>`.

#### Docker images

The docker images for the back-end and the Database are available on DockerHub.

The image of the *simple Beluga Planner* you have to build. 
See [repository](https://gitlab.aniti.fr/tuples/use-cases/beluga/simple-beluga-planner-demonstrator-service#)


#### Start Docker

To run all containers together run:

    docker compose up

in the folder `beluga_test`


