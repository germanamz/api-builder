import { basename, dirname, extname, join } from 'path';

import { KnownMethods, KnownMethodsList } from '../constants/KnownMethods';
import { ApiRoute } from '../interfaces/ApiRoute';
import getRouteModule from '../webpack/getRouteModule';

async function prepareRoute(path: string): Promise<ApiRoute> {
  const params = path.match(/{[\w]+}/g) || [];
  const filename = basename(path, extname(path));
  const absPath = join(process.cwd(), path);
  let method: KnownMethods = KnownMethods.GET;
  let route = dirname(path);

  if (KnownMethodsList.some((allowedMethod) => allowedMethod === filename)) {
    method = filename as KnownMethods;
  } else {
    route = join(route, filename);
  }

  const id = path
    .replace(/\//g, '-')
    .replace(/\.[jt]s$/g, '')
    .replace(/\.$/g, '-')
    .replace(/[{}]/g, '');
  const module = await getRouteModule(absPath, id);

  return {
    id,
    module,
    path,
    absPath,
    route: route.replace(/^routes\//g, ''),
    method,
    params: params.map((param: string) => param.replace(/[{}]/g, '')),
  };
}

export default prepareRoute;
