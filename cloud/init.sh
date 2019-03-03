#!/bin/bash

curl -o- https://deb.nodesource.com/setup_11.x | bash

apt install -y nodejs 
apt install -y build-essential
echo "NODE installed"

apt install -y nginx
echo "NGINX installed"

export PORT=8080
useradd -m app
usermod -aG app ubuntu
echo "User app created"

mkdir -p /app/retro
chown -R ubuntu:app /app/retro
chmod -R g+rwX /app/retro
git clone https://github.com/egde/retro /app/retro
echo "Code downloaded"

cd /app/retro/frontend
npm install -g react-scripts
npm install
npm run build
echo "Retro frontend built"

cd /app/retro/backend
npm install

chown -R app:app /app/retro
chmod -R g+rwX /app/retro
echo "Retro backend built"

npm install -g pm2
sudo -u app pm2 start /app/retro/backend/src/app.js
echo "Retro backend running"

cp -f /app/retro/cloud/default /etc/nginx/sites-available/default
echo "NGINX configured"

sudo systemctl restart nginx
echo "NGINX restarted"