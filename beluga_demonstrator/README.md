# Beluga Demonstrator

For the general setup of IPEXCO please check out the main README.

For a setup using docker images for all components (front-end, back-end, services and database)
use the docker compose file in the folder `full_docker_setup`
This setup only includes a domain dependent planner for the competition JSON encoding.

## General Setup

`full_docker_setup` contains a docker compose and two environments. 
You must define the following parameters:

`docker-compose.yml`:

Replace `<absolute bath to local folder>` with absolute paths to two **different** 
folders on your home system. These folders are used by the back-end and the 
database to store the uploaded data.

The front-end container is running an nginx on port `80`. You must map it to the 
port (replace `<open port>`) you want to serve the application to.
The nginx already implements a reverse proxy for the API calls to the back-end
container.


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
- `MONGO_DB`: a unique name for the database used by the job scheduler of the service

**Attention**: If you register a new service in the web interface, then the
requested API Key and the `API_KEY` defined in the service environment 
must match.

### Partial Docker Setup

If you want to run for example the front-end natively, then you can comment
it out from the docker compose. 

For the docker containers and the natively running font-end server to communicate 
add the option 

```
network_mode: "host"
```

to all remaining components in the docker compose. In this case the port mapping 
is no longer used.

#### Setup on MacOS

On MacOS network mode `host` is not supported. Therefore, you need a few changes to make the docker-compose work.

1. Remove all the `network_mode: "host"` lines in the `docker-compose.yml` file.
2. In every `.env` file change the `MONGO_DB` value to `MONGO_DB=mongodb://mongo:27017/<whatever_you_want>`.

#### Docker images

The docker images for the back-end and the Database are available on DockerHub.


#### Start Docker

To run all containers together run:

    docker compose up

in the folder `full_docker_setup`

## Front-End Configuration

To initialize the demonstrator, perform the following steps:

**Create Beluga domain and register planner and explainer**:

1. Go to the Menu in the top left corner and then to IPEXCO.
1. Go to the Menu in the top left corner and then to Specifications.
1. Add a Beluga Domain. Give it a name containing *Beluga* and select as encoding 
    `DOMAIN_DEPENDENT`.
1. Add the simple Beluga planner as a service. As type select `PLANNER` as 
URL `http://localhost:3336` (If you have not changed any of the default settings),
as API Key what you defined in the *env* file of the simple beluga docker container, as 
encoding `DOMAIN_DEPENDENT` and as domain the Beluga domain you just created.
1. Add the simple Beluga planner as a service. As type select `EXPLAINER` as 
URL `http://localhost:3336` (If you have not changed any of the default settings),
as API Key what you defined in the *env* file of the simple beluga docker container, as 
encoding `DOMAIN_DEPENDENT` and as domain the Beluga domain you just created.


**Create a Project**:

1. Now go back to the main menu (top left corner) and select Beluga System.
1. Now go back to the main menu (top left corner) and select Projects.
1. Create a new project by uploading upload a Beluga JSON file from the competition.
An example file is given in `beluga/example_data/beluga/json`.

