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
this 
