import { KnownMethods } from '../constants/KnownMethods';
import routesWalker from '../helpers/routesWalker';
import { ApiRoute } from '../interfaces/ApiRoute';

async function prepareRoutes() {
  const routes: { [path: string]: { [method in KnownMethods]: ApiRoute } } = {};
  const paths: string[] = [];
  await routesWalker(async (apiRoute: ApiRoute) => {
    const { route, method } = apiRoute;

    if (!routes[route]) {
      paths.push(route);
    }

    const routeMethods = routes[route] || {};

    routeMethods[method] = apiRoute;
    routes[route] = routeMethods;
  });

  return { routes, paths };
}

export default prepareRoutes;
