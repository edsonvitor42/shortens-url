#!/bin/bash

# -----> CREATE VARIABLES <----- #
IMAGE_VERSION=1.0.0
ENVIRONMENT="production"
PROJECT_NAME="shortens-url"

read -p "Deseja continuar com o deploy para o ambiente de $ENVIRONMENT na versão $IMAGE_VERSION? (S/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Ss]$ ]]
then
    # Volta para a raiz do projeto.
    cd ..

    if [[ "$(docker container inspect -f '{{.State.Running}}' $PROJECT_NAME)" =~ "true" ]]; then DEV_DOCKER_CONTAINER="docker exec -it $PROJECT_NAME"; fi

    $DEV_DOCKER_CONTAINER npm install

    echo "BUILD DO ($PROJECT_NAME)."

    # -----> BUILD IMAGE TAQE <----- #

    $DEV_DOCKER_CONTAINER npm run build 

    # Cria a imagem da aplicação.
    docker build -f ./Dockerfile -t $PROJECT_NAME-image:latest .
fi

exit
