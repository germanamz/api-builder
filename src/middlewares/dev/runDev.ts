/* eslint-disable no-underscore-dangle */

import express, { Express, Request, Response } from 'express';
import { initialize } from 'express-openapi';
import { watch } from 'fs/promises';
import { createServer, Server } from 'http';
import { Module } from 'module';
import { basename, dirname, extname, join, resolve } from 'path';
import { promisify } from 'util';
import webpack, { Stats } from 'webpack';

import BuilderErrors, { genBuilderError } from '../../errors/BuilderErrors';
import eventFromReq from '../../helpers/eventFromReq';
import getConfig from '../../helpers/getConfig';
import BuildPipelineArgv from '../../types/argvs/DevPipelineArgv';
import Context from '../../types/Context';
import { Handler } from '../../types/Handler';
import Middleware from '../../types/Middleware';
import RouterConfig from '../../types/RouterConfig';
import { Route } from '../../types/Routes';
import SupportedHttpMethods, {
  SupportedMethodsArray,
} from '../../types/SupportedHttpMethods';
import genApiError from '../../utils/genApiError';
import common from '../../webpack/config/common.config';

const fsMonkey = require('fs-monkey');

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
  });
  server.listen(port, () => {
    console.log(`Dev server running on http://localhost:${port}`);
  });
};

const buildRouter = async (endpoint: string, route: Route, ctx: Context) => {
  const { outFs, ufs, api } = ctx;
  const routerDir = resolve(process.cwd(), 'routes', endpoint);
  const routerPath = resolve(routerDir, 'index.ts');
  const { name } = route;
  const config = common({
    entry: routerPath,
    output: routerDir,
    filename: `${name}.js`,
    externals: api.externals,
  });
  const compiler = webpack(config);
  const run = promisify(compiler.run).bind(compiler);

  compiler.inputFileSystem = ufs;
  compiler.outputFileSystem = outFs;

  const stats = (await run()) as Stats;

  if (stats.hasErrors()) {
    console.error(stats.toJson({ errors: true }).errors);
    process.exit(1);
  }

  const buildFile = join(routerDir, `${route.name}.js`);
  const buildContent: string = (await outFs.promises.readFile(
    buildFile,
    'utf8'
  )) as string;
  // @ts-ignore
  const paths = Module._nodeModulePaths(routerDir);
  // @ts-ignore
  const mod = new Module(buildFile) as any;
  mod.filename = buildFile;
  mod.paths = paths;
  // @ts-ignore
  mod._extensions = {};
  fsMonkey.patchRequire(ufs, false, mod);
  mod._compile(buildContent, buildFile);

  return mod.exports.handler;
};

const handleFile = async (
  ctx: Context,
  filename: string,
  routesPath: string
) => {
  const { routes, openapi } = ctx;
  const endpoint = dirname(filename);
  let method = basename(filename, extname(filename)) as SupportedHttpMethods;

  if ((method as string) === 'index') {
    method = 'GET';
  }

  const lowMethod = method.toLowerCase();
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
      [lowMethod]: {
        ...openapi.paths[endpoint][lowMethod],
        ...(routerConfig?.actionConfig?.[method] || {}),
        operationId: route.name,
      },
    };
  }

  if (SupportedMethodsArray.indexOf(method) === -1) {
    throw genBuilderError(BuilderErrors.METHOD_NOT_SUPPORTED);
  }

  return [route.name, await buildRouter(endpoint, routes[endpoint], ctx)];
};

const opWrapper =
  (handler: Handler<typeof genApiError>) =>
  async (req: Request, res: Response) => {
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
  const { routersPaths } = ctx;
  const routesPath = resolve(process.cwd(), 'routes');
  const operations: any = {
    'cors-operation': opWrapper(async () => ({
      statusCode: 200,
      body: 'ok',
      isBase64Encoded: false,
      headers: {},
    })),
  };
  const watcher = await watch(routesPath, {
    recursive: true,
  });

  for await (const routerPath of routersPaths) {
    const [op, handler] = await handleFile(ctx, routerPath, routesPath);
    operations[op] = opWrapper(handler);
  }

  await initApi(ctx, argv, operations);

  for await (const { eventType, filename } of watcher) {
    // wait for change events to happen
    if (eventType === 'change') {
      const [op, handler] = await handleFile(ctx, filename, routesPath);
      operations[op] = opWrapper(handler);
      await initApi(ctx, argv, operations);
    }
  }
};

export default runDev;
