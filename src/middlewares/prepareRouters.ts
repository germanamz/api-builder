import ejs from 'ejs';
import { readFile } from 'fs-extra';
import { join, resolve } from 'path';

import Context from '../types/Context';
import Middleware from '../types/Middleware';

const prepareRouters: Middleware<keyof Context, 'routersPaths'> = async (
  ctx
) => {
  const { routes, inFs } = ctx;
  const routersPaths = [];
  const routesFolder = resolve(process.cwd(), 'routes');
  const routerTemplate = ejs.compile(
    await readFile(resolve(__dirname, '../templates/router.ts.ejs'), 'utf8')
  );

  for await (const [endpoint, config] of Object.entries(routes)) {
    const routerPath = join(endpoint, 'index.ts');
    const absPath = join(routesFolder, routerPath);

    await inFs.promises.mkdir(join(routesFolder, endpoint), {
      recursive: true,
    });
    await inFs.promises.writeFile(absPath, routerTemplate(config));
    routersPaths.push(routerPath);
  }

  return {
    routersPaths,
  };
};

export default prepareRouters;
