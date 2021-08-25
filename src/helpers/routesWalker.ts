import { opendir } from 'fs/promises';
import { join, resolve } from 'path';

import { ApiRoute } from '../interfaces/ApiRoute';
import prepareRoute from './prepareRoute';

async function routesWalker(
  cb: (apiRoute: ApiRoute) => Promise<void>,
  path: string = 'routes'
) {
  const routesDir = await opendir(resolve(process.cwd(), path));

  // eslint-disable-next-line no-restricted-syntax
  for await (const route of routesDir) {
    const routePath = join(path, route.name);
    if (route.isDirectory()) {
      await routesWalker(cb, routePath);
    } else if (/\.[tj]s$/.test(route.name)) {
      await cb(await prepareRoute(routePath));
    }
  }
}

export default routesWalker;
