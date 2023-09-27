# escala

DBSWA: Project 1

## CLI Commands

```bash
# build images individually per Dockerfile
$ cd grader-api && docker build -t grader-api .
$ cd programming-api && docker build -t programming-api .
$ cd programming-ui && docker build -t programming-ui .
$ cd grader-image && docker build -t grader-image .
$ cd e2e-playwright && docker build -t e2e-playwright .

# buid docker images based on docker-compose on production mode; running on port 7800
# remove app-cache from previous debug mode before proceeding (First build)
cd escala && docker compose -f docker-compose.prod.yml up -d --build
# to restart on prod mode; running on port 7800
docker compose -f docker-compose.prod.yml up -d

# buid/rebuild docker images based on docker-compose on debug mode; running on port 7800
# remove app-cache/ && production-database-data/ from previous production mode before proceeding
cd escala && docker compose up --build # (first build)
# to restart on debug mode on port 7800
cd escala && docker compose up

# stop running app all modes
$ docker compose down

# clean slate docker hub; some of the containers, images, volume must be remove manually
$ docker system prune -a && docker images prune -a && docker volume rm $(docker volume ls -q) && docker volume prune -a

# run unit test on dev mode
# check the browser if there are errors or make a post request to verify, then repeat the steps before running the test
# passing a test can only produced onces, succeeding test will fail and you need to restart the steps
# steps
$ docker compose down
$ docker compose up # on one terminal; Be sure there is no error on the terminal and all modules are downloaded properly or else the app will not run, repeat step 1
$ docker-compose run --entrypoint=npx e2e-playwright playwright test && docker-compose rm -sf # other terminal

```
