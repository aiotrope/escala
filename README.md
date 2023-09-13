# kalayaan
DBSWA: Project 1


## CLI Commands

```bash
# build images
$ cd <dir-name> && docker build -t <dir-name> .

# start app at the root directory; application running on port 7800 (production); first run
$ cd kalayaan && docker compose -f docker-compose.prod.yml -d

# start app at the root directory; application running on port 7800 (dev)
$ cd kalayaan && docker compose up 

# stop running app
$ docker compose down

# start app on succeeding run 
$ docker compose up

# delete all containers
$ docker rm -f $(docker ps -a -q)

# delete all volumes
$ docker volume rm $(docker volume ls -q)

```