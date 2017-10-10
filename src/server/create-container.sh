#!/bin/bash

APP_ROOT=$1
IMAGES=$2
PORT=$3

if [ "$APP_ROOT" == "" ] || [ "$IMAGES" == "" ] || [ "$PORT" == "" ]; then
	echo >&2
	echo "USAGE: create-container.sh APP_ROOT IMAGES_ROOT PORT" >&2
	echo >&2
	exit -1
fi

docker rm boatfights

docker create \
	-v $IMAGES:/images \
	-v $APP_ROOT:/app \
	--name boatfights \
	-p $PORT:3000 \
	boatfights \
	/app/src/server/main.js