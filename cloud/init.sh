sudo apt update
sudo apt upgrade -y

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
. ~/.nvm/nvm.sh

nvm install stable
nvm use stable

sudo apt install nginx -y
