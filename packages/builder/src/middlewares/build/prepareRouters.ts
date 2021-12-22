import { Stage } from '@the-api-builder/registry';
import ejs from 'ejs';
import { pathExists, readFile } from 'fs-extra';
import { join, resolve } from 'path';
import { promisify } from 'util';
import webpack from 'webpack';

import BuildPipelineContext from '../../types/BuildPipelineContext';
import Context from '../../types/Context';
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
      externals: ['@feprisa/errno'],
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

const prepareRouters: Stage<BuildPipelineContext> = async (ctx) => {
  const { routes, inFs } = ctx;
  const routersPaths = [];
  const routesFolder = resolve(process.cwd(), 'routes');
  const routerTemplate = ejs.compile(
    await readFile(resolve(__dirname, '../../templates/router.ts.ejs'), 'utf8')
  );
  const internalWrapperBuild = await buildInternalHandlerWrapper(ctx as any);

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
