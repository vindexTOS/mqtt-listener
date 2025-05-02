#!/bin/sh

# Variables
IMAGE_NAME="mqtt-listiner"
CONTAINER_NAME="mqtt-listiner"
PORT=3000
 
EXISTING_CONTAINER=$(docker ps --format '{{.ID}} {{.Ports}}' | grep "0.0.0.0:${PORT}" | awk '{print $1}')

if [ -n "$EXISTING_CONTAINER" ]; then
  echo "Stopping container $EXISTING_CONTAINER that is using port ${PORT}..."
  docker stop "$EXISTING_CONTAINER"
  echo "Removing container $EXISTING_CONTAINER..."
  docker rm "$EXISTING_CONTAINER"
fi

echo "Building Docker image ${IMAGE_NAME}..."
docker build -t ${IMAGE_NAME} .

echo "Running Docker container ${CONTAINER_NAME}..."
docker run -d \
  -p ${PORT}:3000 \
  -e TZ=Asia/Tbilisi \
  --name ${CONTAINER_NAME} \
  ${IMAGE_NAME}
