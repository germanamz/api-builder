import { genError } from '@the-api-builder/errno';
import { BuilderErrors } from '@the-api-builder/errors';
import { Stage } from '@the-api-builder/registry';
import {
  getConfig,
  getRouterConfigFiles,
  RouterConfigFiles,
} from '@the-api-builder/utils';
import { opendir } from 'fs/promises';
import { basename, extname, join, resolve } from 'path';

import Context from '../Context';
import Routes from '../Routes';
import {
  SupportedHttpMethodsSet,
  SupportedMethodsArray,
} from '../SupportedHttpMethods';

const loadRoutes: Stage<Context> = async (ctx) => {
  const extensions = ['.js', '.ts'];
  const routes: Routes = {};

  const getRoutes = async (path: string = ''): Promise<any> => {
    const routesDirPath = resolve(process.cwd(), 'routes', path);
    const routesDir = await opendir(routesDirPath);

    for await (const route of routesDir) {
      const routePath = join(path, route.name);
      if (route.isDirectory()) {
        await getRoutes(routePath);
      } else if (
        extensions.indexOf(extname(route.name)) !== -1 &&
        RouterConfigFiles.indexOf(route.name) === -1
      ) {
        const method = basename(routePath.replace(extname(route.name), ''));
        const endpoint = path;

        if (SupportedMethodsArray.indexOf(method as any) === -1) {
          throw genError(BuilderErrors.ROUTER_AS_DIRECTORY);
        }

        if (!routes[endpoint]) {
          routes[endpoint] = {
            methods: [],
            name: endpoint
              .replace(/\//g, '-')
              .replace(/\.[jt]s$/g, '')
              .replace(/\.$/g, '_')
              .replace(/[{}]/g, '')
              .toLowerCase(),
            config: await getConfig(
              ctx as any,
              getRouterConfigFiles(routesDirPath)
            ),
          };
        }

        routes[endpoint].methods.push(method as SupportedHttpMethodsSet);
      }
    }
  };

  await getRoutes();

  return {
    routes,
  };
};

export default loadRoutes;
