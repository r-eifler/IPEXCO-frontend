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

## Setup on Macos

On MacOs network mode `host` is not supported. Therefore, you need a few changes to make the docker-compose work.

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

### Front-End

For instructions how to run the front-end see the main README of this 
repository.

## IPEXCO Setup

To compute a plan for a domain dependent Beluga instance, perform the following 
steps

1. Register: When you open IPEXCO for the first time click on *Register*. 
    Select a username and password. Make sure to save it. There is no option 
    to reset your password.
1. Go to the Menu in the top left corner and then to Specifications.
1. Add a Beluga Domain. Give it a name containing *Beluga* and select as encoding 
    `DOMAIN_DEPENDENT`.
1. Add the simple Beluga planner as a service. As type select `PLANNER` as 
URL `http:localhost:3336` (If you have not changed any of the default settings),
as API Key what you defined in the *env* file of the docker container, as 
encoding `DOMAIN_DEPENDENT` and as domain the Beluga domain you just created.
1. Now go back to the main menu (top left corner) and select Projects.
1. Create a new project and select as domain the just created Beluga domain.
In the next step you can upload a Beluga JSON file from the competition.
An example file is given in `setup/example_data/beluga/json`.
1. Click on the right arrow of the new created project.
1. To test and compare different planner *start* the *Planning* feature.
1. Create a new plan. You should be able to select the simple Beluga planner 
you registered in the beginning.
1. If everything works you should get a plan within a few seconds for the included 
sample problem.
1. The *Detail* of a plan gives you for now only a list of the action names.
