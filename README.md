# api-builder
This project is meant to be use on all serverless distributed apis.

It defines a CLI interface and framework for internal apis using npm and terraform to manage, develop and deploy Feprisa's internal apis.

## Prerequisites

* NodeJs@14.x
* Terraform@^1.x

## Setup
The project uses NodeJs and Terraform to perform the creation and deployment of a single api.

It takes advantage of [`OpenApi 3.0.1`](https://spec.openapis.org/oas/v3.0.1) that lets you create and manipulate HTTP api with a Json Schema configuration file (it doesn't support yaml configs yet).

To use `api-builder` its necessary to create your api repo with le following structure.

```
<project_root>/
├── routes // The folder for all lambdas
│   └── <../../action_lambda> // A folder for each lambda with the filesystem path as http path
├── package.json
└── package-lock.json
```

## Routing

Routes are defined as filesystem paths in the `routes` folder. e.g
```
<project_root>/
└── routes/
    ├── Bills/
    │   ├── post.ts
    │   ├── get.ts
    │   └── {billId}/
    │       ├── patch.ts
    │       ├── delete.ts
    │       └── get.ts
    ├── Users.ts
    └── Purchases/
        └── index.ts
```
# Docker builder
To build dependencies that depend on AWS arm arch we use the public Docker image provided by AWS to run the installation process.

This image will install all dependencies and zip all lambdas independently it will generate two files for each router `<router-name>.zip` and `<router-name>.zip.checksum`.

To prepare the image follow these steps:
1. Starting from the root folder of this project...
```shell
cd docker/builder
```

2.
```shell
docker build -t api-builder .
```

Once you have the image ready you can execute this command from the `root folder` of the api you want to build.
```shell
docker run -v `pwd`:/var/task -e CODEARTIFACT_AUTH_TOKEN api-builder
```

`Note: Its important to provide the CODEARTIFACT_AUTH_TOKEN environment variable to give the image access to Feprisa's internal node registry`
