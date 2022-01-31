import { Stage } from '@the-api-builder/registry';
import { RoutesFolderName } from '@the-api-builder/utils';
import ejs from 'ejs';
import { readFile } from 'fs-extra';
import { join, resolve } from 'path';

import { Context } from '../Context';

const prepareRouters: Stage<Context> = async (ctx) => {
  const { routes, inFs } = ctx;
  const routersPaths = [];
  const routesFolder = resolve(process.cwd(), RoutesFolderName);
  const routerTemplate = ejs.compile(
    await readFile(resolve(__dirname, '../templates/router.ts.ejs'), 'utf8')
  );

  for await (const [endpoint, config] of Object.entries(routes)) {
    const routerDir = join(routesFolder, endpoint);
    const routerPath = join(endpoint, 'index.ts');
    const absPath = join(routesFolder, routerPath);
    const routerBuild = routerTemplate({
      ...config,
    });

    await inFs.promises.mkdir(routerDir, {
      recursive: true,
    });
    await inFs.promises.writeFile(absPath, routerBuild);
    routersPaths.push(routerPath);
  }

  return {
    routersPaths,
  };
};

export default prepareRouters;
