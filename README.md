# escala

DBSWA: Project 1

## CLI Commands

```bash

# buid/rebuild docker images based on docker-compose
$ cd escala && docker compose up --build
$ cd grader-image && docker build -t grader-image .

# start app at the root directory; application running on port 7800 (production); first run
$ cd escala && docker compose -f docker-compose.prod.yml -d

# build images individually based on Dockerfile
$ cd grader-api && docker build -t grader-api .
$ cd programming-api && docker build -t programming-ui .
$ cd programming-ui && docker build -t programming-ui .
$ cd grader-image && docker build -t grader-image .

# running buit images
$ cd escala && docker compose up

# stop running app and remove app cache
$ docker compose down && rm -rf app-cache

# start app on succeeding run
$ docker compose up

# delete all volumes, containers, volumes
$ docker system prune -a && docker images prune && docker volume rm $(docker volume ls -q)

# run unit test on dev mode
# check the browser if there are errors or make a post request to verify, then repeat the steps before running the test
# passing a test can only produced onces, succeeding test will fail and you need to restart the steps
# steps
$ docker compose down && rm -rf app-cache
$ docker compose up # on one terminal; Be sure there is no error on the terminal and all modules are downloaded properly or else the app will not run, repeat step 1
$ docker-compose run --entrypoint=npx e2e-playwright playwright test && docker-compose rm -sf # other terminal

```
