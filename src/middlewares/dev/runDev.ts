/* eslint-disable no-underscore-dangle */

import bodyParser from 'body-parser';
import express, { Express, Request, Response } from 'express';
import { initialize } from 'express-openapi';
import { createServer, Server } from 'http';
import { dirname, join, resolve } from 'path';
import { promisify } from 'util';

import eventFromReq from '../../helpers/eventFromReq';
import getConfig from '../../helpers/getConfig';
import BuildPipelineArgv from '../../types/argvs/DevPipelineArgv';
import Context from '../../types/Context';
import { Handler } from '../../types/Handler';
import Middleware from '../../types/Middleware';
import RouterConfig from '../../types/RouterConfig';
import { Route } from '../../types/Routes';
import routerFactory from '../../utils/routerFactory';

let server: Server;
let app: Express;

const initApi = async (
  ctx: Context,
  argv: BuildPipelineArgv,
  operations: any
) => {
  if (server?.listening) {
    console.log('Closing dev server');
    const close = promisify(server.close).bind(server);
    await close();
  }

  console.clear();
  console.log('Starting dev server');
  const { port = 3000 } = argv;
  const { openapi, api } = ctx;
  app = express();
  server = createServer(app);
  initialize({
    app,
    apiDoc: openapi,
    operations,
    externalSchemas: api.schemas,
    consumesMiddleware: {
      'application/json': bodyParser.json(),
      'text/text': bodyParser.text(),
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    errorMiddleware(err, req, res, next) {
      const { status } = err;
      console.log(err);
      res.status(err.status);
      if (status === 400) {
        res.json({
          message: 'Invalid request body',
        });
      } else {
        res.json(err);
      }
    },
  });
  server.listen(port, () => {
    console.log(`Dev server running on http://localhost:${port}`);
  });
};

const buildRouter = async (ctx: Context, endpoint: string, route: Route) => {
  const { errorStatuses, errorMessages } = ctx.api;
  const routerDir = resolve(process.cwd(), 'routes', endpoint);
  const methods: any = {};

  for await (const method of route.methods) {
    const methodHandler = await import(join(routerDir, `${method}.ts`));
    methods[method] = methodHandler.default;
  }

  return routerFactory(errorMessages, errorStatuses, methods);
};

const handleFile = async (
  ctx: Context,
  filename: string,
  isEndpoint?: boolean
): Promise<[string, Handler]> => {
  const { routes, openapi } = ctx;
  const endpoint = isEndpoint ? filename : dirname(filename);
  const routesPath = resolve(process.cwd(), 'routes');
  const route = routes[endpoint];
  let routerConfig: RouterConfig = route.config as RouterConfig;

  if (/\.router\.js(on)?$/.test(filename)) {
    // A router config changed
    routerConfig = (await getConfig(
      ctx,
      resolve(routesPath, filename),
      resolve(routesPath, filename)
    )) as RouterConfig;
    routes[endpoint].config = routerConfig;
    openapi.paths[endpoint] = {
      ...openapi.paths[endpoint],
      ...(route.methods.reduce(
        (acc, method) => ({
          ...acc,
          [method.toLowerCase()]: {
            ...openapi.paths[endpoint][method.toLowerCase()],
            ...(routerConfig.actionConfig?.[method] || {}),
            operationId: route.name,
          },
        }),
        {}
      ) as any),
    };
  }

  return [route.name, await buildRouter(ctx, endpoint, routes[endpoint])];
};

const opWrapper =
  (ctx: Context, handler: Handler) => async (req: Request, res: Response) => {
    const event = await eventFromReq(req);
    const reqCtx: any = {};
    const { body, headers, statusCode } = await handler(event, reqCtx);
    res.status(statusCode);
    res.set({
      'Content-Type': 'application/json',
      ...headers,
    });
    res.send(body);
  };

const runDev: Middleware<keyof Context, null, BuildPipelineArgv> = async (
  ctx,
  argv
) => {
  const { routes } = ctx;
  const operations: any = {
    'cors-operation': opWrapper(ctx, async () => ({
      statusCode: 200,
      body: 'ok',
      isBase64Encoded: false,
      headers: {},
    })),
  };

  for await (const endpoint of Object.keys(routes)) {
    const [op, handler] = await handleFile(ctx, endpoint, true);
    operations[op] = opWrapper(ctx, handler);
  }

  await initApi(ctx, argv, operations);
};

export default runDev;
