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
- Use the following JSON definition and edit accordingly

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

## Create Role

- Navigate to your created OIDC Provider
- Select Assign Role
- Select Create New Role
- Choose web identity
- Select your identity provider from drop down
- Add sts.amazonaws.com as Audience select next
- Attach previously created policy to the role
- Finish process

## Update Role Trusted entities

Once your role is created, navigate back to IAM within the AWS console and find the role you created in the previous step

- Select Trust relationships
- Select Edit Trust Policy
- Configure as follows

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "ARN_OF_YOUR_CREATED_OIDC_PROVIDER_FROM_STEP_ONE"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
                },
                "StringLike": {
                    "token.actions.githubusercontent.com:sub": "repo:GITHUB_ACCOUNT_NAME/GITHUB_ACOUNT_REPO:*"
                }
            }
        }
    ]
}
```

## Github repository variables

The following repository variables are required in order for the workflow to function correctly.

- AWS_ECR_ROLE
- AWS_ECR_REGISTRY
- AWS_REGION

Within GitHub, select your repository and navigate to settings, navigate to secrets and variables on the left hand navigation bar then choose actions.

Under the Actions secrets and variables section choose the variables tab and select New Repository Variable.

- Enter AWS_ECR_ROLE as the variable name 
- Enter the ARN of the Role you created previously eg. arn:aws:iam::YOUR_AWS_ACCOUNT_NUMBER:role/YOUR_ROLE_NAME

Create another repository variables with the following

- Enter AWS_ECR_REGISTRY as the variable name
- Enter the URI of the ECR repository you created previously eg. YOUR_AWS_ACCOUNT_NUMBER.dkr.ecr.eu-west-1.amazonaws.com/YOUR_ECR_REPOSITORY_NAME

Create another repository variable with the following

- Enter AWS_REGION as the variable name
- Enter your aws region eg. eu-west-1

# Sample dockerized node app

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

