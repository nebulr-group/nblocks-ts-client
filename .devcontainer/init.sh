#!/bin/bash
## Usage
## ./init_local.sh WORKSPACE_FOLDER_PATH
PWD=$(dirname $0)
source $PWD/secrets.env

echo "Installing utils using apt..."
apt-get update
apt-get -y install vim less jq curl

echo "Configuring GIT"
git config --global user.email $GIT_EMAIL
git config --global user.name $GIT_NAME

echo "Done dev specific initializing, running workspace_folder/init.sh..."
. $1/init.sh