import { opendir } from 'fs/promises';
import { basename, extname, join, resolve } from 'path';

import RouterConfigFiles from '../../constants/RouterConfigFiles';
import BuilderErrors, { genBuilderError } from '../../errors/BuilderErrors';
import getConfig2 from '../../helpers/getConfig2';
import getRouterConfigFiles from '../../helpers/getRouterConfigFiles';
import Context from '../../types/Context';
import Middleware from '../../types/Middleware';
import Routes from '../../types/Routes';
import SupportedHttpMethods, {
  SupportedMethodsArray,
} from '../../types/SupportedHttpMethods';

const loadRoutes: Middleware<keyof Context, 'routes'> = async (ctx) => {
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
          throw genBuilderError(BuilderErrors.ROUTER_AS_DIRECTORY);
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
            config: await getConfig2(ctx, getRouterConfigFiles(routesDirPath)),
          };
        }

        routes[endpoint].methods.push(method as SupportedHttpMethods);
      }
    }
  };

  await getRoutes();

  return {
    routes,
  };
};

export default loadRoutes;
