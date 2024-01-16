#!/bin/bash

set -e

# Create the network if we don't have it yet
docker network inspect neurodiffhub >/dev/null 2>&1 || docker network create neurodiffhub

# Run Postgres DB and DBMate
docker-compose run --rm --service-ports neurodiffdb-client