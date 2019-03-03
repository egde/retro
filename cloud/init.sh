#!/bin/bash

curl -sL https://deb.nodesource.com/setup_11.x -o nodesource_setup.sh | bash
sudo apt update

sudo apt install nodejs
sudo apt install build-essential
echo "NODE installed"

sudo apt install nginx -y
echo "NGINX installed"

export PORT=8080
sudo useradd -M app
sudo usermod -aG app ubuntu
echo "User app created"

sudo mkdir -p /app/retro
sudo chown -R :app /app/retro
sudo chmod -R g+rwX /app/retro
sudo git clone https://github.com/egde/retro /app/retro
echo "Code downloaded"

cd /app/retro/frontend
npm install
npm run build
echo "Retro frontend built"

cd /app/retro/backend
npm install
echo "Retro backend built"

npm install -g pm2
pm2 start /app/retro/backend/src/app.js
echo "Retro backend running"

cp -f /app/retro/cloud/default /etc/nginx/sites-available/default
echo "NGINX configured"

sudo systemctl restart nginx
echo "NGINX restarted"