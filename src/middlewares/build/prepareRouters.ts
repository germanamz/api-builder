import ejs from 'ejs';
import { pathExists, readFile } from 'fs-extra';
import { join, resolve } from 'path';
import { promisify } from 'util';
import webpack from 'webpack';

import Context from '../../types/Context';
import Middleware from '../../types/Middleware';
import common from '../../webpack/config/common.config';

const buildInternalHandlerWrapper = async (ctx: Context) => {
  let internalHandlerWrapperPath = resolve(
    __dirname,
    '../../utils/internalHandlerWrapper.js'
  );

  if (!(await pathExists(internalHandlerWrapperPath))) {
    internalHandlerWrapperPath = resolve(
      __dirname,
      '../../utils/internalHandlerWrapper.ts'
    );
  }

  const compiler = webpack(
    common({
      entry: internalHandlerWrapperPath,
      output: '/internal',
      filename: 'internalHandlerWrapper.js',
    })
  );

  compiler.inputFileSystem = ctx.ufs;
  compiler.outputFileSystem = ctx.outFs;

  const run = promisify(compiler.run).bind(compiler);
  const stats = await run();

  if (stats?.hasErrors()) {
    console.error(stats.toJson({ errors: true }).errors);
    process.exit(1);
  }

  return ctx.outFs.promises.readFile('/internal/internalHandlerWrapper.js');
};

const prepareRouters: Middleware<keyof Context, 'routersPaths'> = async (
  ctx
) => {
  const { routes, inFs, api } = ctx;
  const { errorMessages, errorStatuses } = api;
  const routersPaths = [];
  const routesFolder = resolve(process.cwd(), 'routes');
  const routerTemplate = ejs.compile(
    await readFile(resolve(__dirname, '../../templates/router.ts.ejs'), 'utf8')
  );
  const internalWrapperBuild = await buildInternalHandlerWrapper(ctx);

  for await (const [endpoint, config] of Object.entries(routes)) {
    const routerDir = join(routesFolder, endpoint);
    const routerPath = join(endpoint, 'index.ts');
    const absPath = join(routesFolder, routerPath);
    const routerHandlerWrapperPath = join(
      routerDir,
      'internalHandlerWrapper.js'
    );
    const routerBuild = routerTemplate({
      ...config,
      errorMessages,
      errorStatuses,
    });

    await inFs.promises.mkdir(routerDir, {
      recursive: true,
    });
    await inFs.promises.writeFile(
      routerHandlerWrapperPath,
      internalWrapperBuild
    );
    await inFs.promises.writeFile(absPath, routerBuild);
    routersPaths.push(routerPath);
  }

  return {
    routersPaths,
  };
};

export default prepareRouters;
