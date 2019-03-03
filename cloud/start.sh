#!/bin/bash

cd /app/retro
git pull

cd /app/retro/frontend
npm install
npm run build

cd /app/retro/backend
npm install

chown -R app:app /app/retro
chmod -R g+rwX /app/retro

sudo -u app pm2 start /app/retro/backend/src/app.js
echo "Retro backend running"