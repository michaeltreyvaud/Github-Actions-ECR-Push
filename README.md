# Github Actions ECR example

Quick example on how you can push a docker image from a github repo into your own AWS ECR repository using github actions

 - Sample Node app
 - Sample AWS Ecr push workflow

# Prerequisites

Setup the following resources before continuing

## Configure OIDC Provider

Click [here](https://us-east-1.console.aws.amazon.com/iamv2/home?region=eu-west-1#/identity_providers) to configure OIDC Provider.

- Select OpenID Connect
- Use https://token.actions.githubusercontent.com as the Provider URL
- Use sts.amazonaws.com as the Audience

## Create ECR Repository

Click [here](https://eu-west-1.console.aws.amazon.com/ecr/repositories?region=eu-west-1) to create your ECR Repository

- Select Create
- Choose Private
- Provide a name to your repository (remember this for later)
- Configure as desired

## Create ECR Policy

Click [here](https://us-east-1.console.aws.amazon.com/iamv2/home?region=eu-west-1#/policies) to create your policy that will be attached to your Provider role.

- Select create Policy
- Use the following JSON definition and edit accordinly

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowPush",
            "Effect": "Allow",
            "Action": [
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:BatchCheckLayerAvailability",
                "ecr:PutImage",
                "ecr:InitiateLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:CompleteLayerUpload"
            ],
            "Resource": [
                "arn:aws:ecr:YOUR_AWS_ACCOUNT_REGION:YOUR_AWS_ACCOUNT_NUMBER:repository/YOUR_ECR_REPOSITORY_FROM_ABOVE"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken"
            ],
            "Resource": "*"
        }
    ]
}
```


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