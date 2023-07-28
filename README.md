# Github Actions ECR example

Quick example on how you can push a docker image from a github repo into your own AWS ECR repository using github actions

 - Sample Node app
 - Sample AWS Ecr push workflow


## Useful

Test app locally
```js
npm install
npm start

App should run on http://localhost:9090/
```

Test app using docker
```js
docker build . -t sample-node-app
docker run -p 9090:9090 -d sample-node-app

App should run on http://localhost:9090/
```