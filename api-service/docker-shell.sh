#!/bin/bash

set -e

# Read the settings file
source ./env.dev

# Create the network if we don't have it yet
docker network inspect neurodiffhub >/dev/null 2>&1 || docker network create neurodiffhub

docker build -t $IMAGE_NAME -f Dockerfile .
docker run --rm --name $IMAGE_NAME -ti --mount type=bind,source="$BASE_DIR",target=/app --mount type=bind,source="$MODELSTORE_DIR",target=/modelstore -p 9000:9000 -e DEV=1 -e DATABASE_URL=$DATABASE_URL -e MODELSTORE_BUCKET=$MODELSTORE_BUCKET --network neurodiffhub $IMAGE_NAME