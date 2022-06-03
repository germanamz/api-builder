import { join, resolve } from 'path';

import RoutesFolderName from '../constants/RoutesFolderName';
import { Route } from '../types/Routes';
import routerFactory from './routerFactory';

const buildRouter = async (endpoint: string, route: Route) => {
  const routerDir = resolve(process.cwd(), RoutesFolderName, endpoint);
  const methods: any = {};

  for await (const method of route.methods) {
    const methodHandler = await import(join(routerDir, `${method}.ts`));
    methods[method] = methodHandler.default;
  }

  return routerFactory(methods);
};

export default buildRouter;
