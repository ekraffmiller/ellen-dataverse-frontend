#!/usr/bin/env bash

export DATAVERSE_BRANCH_NAME=$1
export WITH_DATA_OPTION_VALUE=${2:-unset}

# To avoid timeout issues on frontend container startup
export COMPOSE_HTTP_TIMEOUT=200

DATAVERSE_API_BASE_URL=http://localhost:8000/api

echo "INFO - Setting up Dataverse on branch ${DATAVERSE_BRANCH_NAME}..."

echo "INFO - Removing current environment if exists..."
./rm-env.sh

echo "INFO - Cloning Dataverse backend repository..."
git clone -b ${DATAVERSE_BRANCH_NAME} https://github.com/IQSS/dataverse.git

echo "INFO - Running docker containers..."
docker-compose -f "./docker-compose-dev.yml" up -d --build

echo "INFO - Waiting for containers to be ready..."
# Up to ~5 minutes
max_attempts=30
n_attempts=0
until $(curl --output /dev/null --silent --head --fail ${DATAVERSE_API_BASE_URL}/info/version); do
   if [ ${n_attempts} -eq ${max_attempts} ];then
     echo "ERROR - Timeout reached while waiting for containers to be ready"
     ./rm-env.sh
     rm -rf dataverse
     exit 1
   fi
   n_attempts=$(($n_attempts+1))
   sleep 10
done

echo "INFO - Bootstrapping dataverse..."
cd dataverse
./scripts/dev/docker-final-setup.sh

echo "INFO - Cleaning up repository..."
cd ..
rm -rf dataverse

if [ "$WITH_DATA_OPTION_VALUE" == "wd" ]; then
  echo "INFO - Adding data to the environment..."
  ./add-env-data.sh
fi
