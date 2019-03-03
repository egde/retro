#!/bin/bash

sudo apt update

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
. ~/.nvm/nvm.sh

nvm install stable
nvm use stable

sudo apt install nginx -y


export PORT=8080
sudo useradd -M app
sudo usermod -aG app ubuntu

sudo mkdir -p /app/retro
sudo chown -R :app /app/retro
sudo chmod -R g+rwX /app/retro
sudo git clone https://github.com/egde/retro /app/retro

cd /app/retro/frontend
npm install
npm run build

cd /app/retro/backend
npm install

npm install -g pm2
pm2 start /app/retro/backend/src/app.js

mv -f /app/retro/cloud/default /etc/nginx/sites-available/default

sudo systemctl restart nginx