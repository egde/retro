# retro - A small nimble tool for doing retrospectives

Retro allows you to perform a retrospective for those teams that are geographically apart or as it is completely anonymous are too shy to voice their concerns in the meeting  in front of everyone.

One important design goal of retro is to have everything anonymised. Only a cookie is used to identify you on your machine. Nothing else. No registration, no username required.

![Screenshot of retro web app](https://raw.githubusercontent.com/egde/retro/master/docs/retro-sample.png)

## Building
### Requirements
* Node 11.10.0
* NPM 6.8.0
* git

### Actions
Open up a shell orcommand line tool:
```
git clone https://github.com/egde/retro
npm install -g react-scripts
cd frontend
npm install
npm run build
cd ../backend
npm install
npm run dev
```

## Run it on AWS Lightsail
Scripts are available to run retro on AWS Lightsail.

1. Create an Ubuntu 18.04 instance with 512MB and 20 GB of storage
2. Copy and paste the following line for the launch script:
```
curl -o- https://raw.githubusercontent.com/egde/retro/master/cloud/init.sh | bash
```
3. Launch the instance and in ca. 30 mins the retro web app is up and running

![AWS Lightsail Configuration](https://raw.githubusercontent.com/egde/retro/master/docs/aws-lightsail-setup.png)
