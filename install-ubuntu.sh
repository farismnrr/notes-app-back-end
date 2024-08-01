#! /bin/bash
# Ubuntu 22.04

# Update and upgrade
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
## Add Docker's official GPG key:
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

## Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

## Install Docker Engine
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Install NodeJS
## Install curl
sudo apt-get install -y curl

## Install NodeJS
curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh
sudo -E bash nodesource_setup.sh
sudo apt-get install -y nodejs

# Update and upgrade
sudo apt-get update && sudo apt-get upgrade -y

## Create postgres and custom commands
cat << EOF >> ~/.bashrc
# Create postgres command
alias postgres_start='sudo docker run --name postgres-sql -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres && docker exec -it postgres-sql psql -U postgres -c "CREATE DATABASE postgres"; sudo docker start postgres-sql'
alias postgres_stop='sudo docker stop postgres-sql && sudo docker rm postgres-sql'

# Create rabbitmq command
alias rabbitmq_start='sudo docker run --name rabbitmq -p 5672:5672 -p 15672:15672 -d rabbitmq:management'
alias rabbitmq_stop='sudo docker stop rabbitmq && sudo docker rm rabbitmq'

# Create custom command
alias docker_remove='sudo docker rmi -f $(sudo docker images -q)'
alias docker_start='askin_start && rabbitmq_start && redis_start && postgres_start'
alias docker_stop='sudo docker rm -f $(sudo docker ps -a -q) && sudo docker system prune -f'
alias pm2_stop='pm2 stop all && pm2 delete all || sudo pm2 stop all && sudo pm2 delete all'
EOF

# Install services by Docker
## Install rabbitmq by Docker
sudo docker run --name rabbitmq -p 5672:5672 -p 15672:15672 -d rabbitmq:management
sudo docker start rabbitmq

## Install postgresql by Docker
sudo docker run --name postgres-sql -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
sudo docker exec -it postgres-sql psql -U postgres -c "CREATE DATABASE postgres"
sudo docker start postgres-sql