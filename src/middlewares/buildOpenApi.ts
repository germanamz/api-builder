import { outputJSON } from 'fs-extra';
import { resolve } from 'path';

import { ApiConfig } from '../types/ApiConfig';
import CommonArgv from '../types/CommonArgv';
import Context from '../types/Context';
import Middleware from '../types/Middleware';
import SupportedHttpMethods from '../types/SupportedHttpMethods';

const getLambdaArn = (lambda: string, api: ApiConfig) =>
  `arn:aws:apigateway:${api.region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${api.region}:${api.accountId}:function:${lambda}/invocations`;

const getLambdaIntegration = (lambda: string, api: ApiConfig) => ({
  type: 'aws_proxy',
  responses: {
    default: {
      statusCode: '200',
    },
  },
  uri: getLambdaArn(lambda, api),
  passthroughBehavior: 'when_no_match',
  httpMethod: 'POST',
  contentHandling: 'CONVERT_TO_TEXT',
});

const getCors = () => ({
  responses: {
    200: {
      content: {},
      headers: {
        'Access-Control-Allow-Origin': {
          schema: {
            type: 'string',
          },
        },
        'Access-Control-Allow-Methods': {
          schema: {
            type: 'string',
          },
        },
        'Access-Control-Allow-Headers': {
          schema: {
            type: 'string',
          },
        },
      },
    },
  },
  'x-amazon-apigateway-integration': {
    type: 'mock',
    requestTemplates: {
      'application/json': '{ "statusCode": 200 }',
    },
    responses: {
      default: {
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Headers':
            "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'",
          'method.response.header.Access-Control-Allow-Methods': "'*'",
          'method.response.header.Access-Control-Allow-Origin': "'*'",
        },
        responseTemplates: {
          'application/json': '{}',
        },
      },
    },
  },
});

export type BuildOpenApiArgv = CommonArgv & {
  openapiOutput?: string;
  openapiStdout?: boolean;
};

const buildOpenApi: Middleware<keyof Context, 'openapi', BuildOpenApiArgv> =
  async (ctx, argv) => {
    const { openapiOutput, openapiStdout } = argv;
    const { api, package: packageJson, routes } = ctx;
    const paths: {
      [path: string]: { [method in Lowercase<SupportedHttpMethods>]: any };
    } = {};
    for (const route of Object.keys(routes)) {
      const routePath = `/${route}`;
      const { name, config, methods } = routes[route];
      paths[routePath] = paths[routePath] || { OPTIONS: getCors() };
      for (const method of methods) {
        const methodConfig = config?.actionConfig?.[method] || {};
        const lowerMethod =
          method.toLowerCase() as Lowercase<SupportedHttpMethods>;
        paths[routePath][lowerMethod] = {
          'x-amazon-apigateway-request-validator': 'all',
          ...methodConfig,
          'x-amazon-apigateway-integration': getLambdaIntegration(
            `${api.name}-${name}-${process.env.NODE_ENV}`,
            api
          ),
        };
      }
    }
    const openapi = {
      openapi: '3.0.1',
      info: {
        title: api.name,
        version: packageJson.version,
      },
      'x-amazon-apigateway-request-validators': {
        all: {
          validateRequestBody: true,
          validateRequestParameters: true,
        },
      },
      'x-amazon-apigateway-request-validator': 'all',
      paths,
      components: {
        schemas: api.schemas,
      },
    };

    if (openapiOutput || api.openapiOutput) {
      await outputJSON(
        resolve(process.cwd(), openapiOutput || (api.openapiOutput as string)),
        openapi
      );
    }

    if (openapiStdout) {
      console.log(JSON.stringify(openapi));
    }

    return {
      openapi,
    };
  };

export default buildOpenApi;
