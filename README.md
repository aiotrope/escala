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

# running buit images
$ cd escala && docker compose up

# stop running app and remove app cache
$ docker compose down && rm -rf app-cache

# start app on succeeding run
$ docker compose up

# delete all volumes, containers, volumes
$ docker system prune -a && docker images prune && docker volume rm $(docker volume ls -q)

```
