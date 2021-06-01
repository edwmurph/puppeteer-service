#!/bin/bash

if [[ $NODE_ENV == 'production' || $NODE_ENV == 'development' ]]; then
  echo "running function in $NODE_ENV"
else
  echo "NODE_ENV '$NODE_ENV' must be either development or production"
  exit 1
fi

if [ -n "$MAX_RANDOM_START_DELAY" ]; then
  delay=$(node -e "console.log(Math.floor(Math.random() * $MAX_RANDOM_START_DELAY) + 1)")
  echo "random start delay: $delay"
  sleep $delay
fi

node "./functions/$1"
