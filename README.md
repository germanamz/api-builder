# api-builder
It defines a CLI interface and framework for internal apis using npm and terraform to manage, develop and deploy REST API's.

## Prerequisites

* NodeJs@14.x
* Terraform@^1.x

## Setup
The project uses NodeJs and Terraform to perform the creation and deployment of a single api.

It uses [`OpenApi 3.0.1`](https://spec.openapis.org/oas/v3.0.1) that lets you create and manipulate HTTP api with a Json Schema configuration file (it doesn't support yaml configs yet).

To use `api-builder` its necessary to create your api repo with le following structure.

```
<project_root>/
├── routes // The folder for all lambdas
│   └── <../../action_lambda> // A folder for each lambda with the filesystem path as http path
├── package.json
└── package-lock.json / yarn.lock
```

## Routing

Routes are defined as filesystem paths in the `routes` folder. e.g
```
<project_root>/
└── routes/
    ├── Products/
    │   ├── POST.ts
    │   ├── GET.ts
    │   └── {productId}/
    │       ├── PATCH.ts
    │       ├── DELETE.ts
    │       └── GET.ts
    ├── Users.ts // Defaults to GET
    └── Vouchers/
        └── POST.ts
```

For now the only HTTP methods supported are `POST, GET, PATCH, DELETE`.

By naming a with the HTTP method you define an endpoint the file system path you used.

On the previews example we have 2 folders Products and Vouchers inside them, we define some methods and the HTTP path becomes the file system path. eg

```
POST /Products/
GET  /Products/
GET  /Products/{productId}
GET  /Users/
POST /Vouchers/
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

We recommend extending this image to actually configure private registries like GemFury or AWS Artifact. Take a look at the Dockerfile.
