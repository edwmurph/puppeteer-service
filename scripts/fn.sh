#!/bin/bash

if [[ $NODE_ENV == 'production' || $NODE_ENV == 'development' ]]; then
  echo "running function in $NODE_ENV"
else
  echo "NODE_ENV '$NODE_ENV' must be either development or production"
  exit 1
fi

node "./functions/$1"
