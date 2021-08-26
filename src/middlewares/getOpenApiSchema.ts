import { KnownMethods } from '../constants/KnownMethods';
import getCors from '../helpers/getCors';
import getLambdaIntegration from '../helpers/getLambdaIntegration';
import { ApiRoute } from '../interfaces/ApiRoute';
import { Router } from '../interfaces/Router';
import { MiddlewareContext } from '../registry';

async function getOpenApiSchema(ctx: MiddlewareContext) {
  const { packageJson, paths: ctxPaths, routes, routers, api } = ctx;
  const paths: any = ctxPaths.reduce((pathsAcc: any, path: string) => {
    const routeMethods = Object.keys(routes[path]) as KnownMethods[];
    const methodsDef: any = routeMethods.reduce(
      (methodsAcc: any, method: KnownMethods) => {
        const route: ApiRoute = routes[path][method];
        const router = routers.find(
          (routerItem) => routerItem.path === path
        ) as Router;
        const routeModuleConfig = route.module.module.getActionConfig
          ? route.module.module.getActionConfig()
          : {};

        return {
          ...methodsAcc,
          [method]: {
            'x-amazon-apigateway-request-validator': 'all',
            ...routeModuleConfig,
            'x-amazon-apigateway-integration': getLambdaIntegration(
              router.lambdaName as string
            ),
          },
        };
      },
      {}
    );

    return {
      ...pathsAcc,
      [path]: {
        options: getCors(),
        ...methodsDef,
      },
    };
  }, {});

  const openApiSchema = {
    openapi: '3.0.1',
    info: {
      title: packageJson.name,
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

  return { schema: openApiSchema };
}

export default getOpenApiSchema;
