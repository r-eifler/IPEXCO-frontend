# Beluga Demonstrator BACK END

The demonstrator is based on [IPEXCO](https://github.com/r-eifler/IPEXCO-frontend).

## Docker Image

Unless you want to change/update the front end, we suggest running it in a docker container. 
We provide a pre-build docker image on DockerHub ([here](https://hub.docker.com/repository/docker/tuplestai/beluga-demonstrator-front-end/general)): 

```
tuplestai/beluga-demonstrator-front-end
```

If you want to build your own docker image run

```
docker build -t beluga-demonstrator-front-end .
```

## Setup

### Dependencies

The dependencies are:

- `npm` (https://www.npmjs.com/)
- `node.js` version 22 (https://nodejs.org/en)
- *Angular CLI* version 22 (https://angular.dev/tools/cli/setup-local)


Before the first run install npm packages with:

```
npm install
```

### Run

To run the development server on the default port (`4200`) run:

```
npm start
```
If you want to use a different port run

```
ng serve --port <port>
```

