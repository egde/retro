#!/bin/bash

sudo apt update
echo "Update completed"

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
. ~/.nvm/nvm.sh
echo "NVM installed"

nvm install stable
nvm use stable
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