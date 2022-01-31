import { Stage } from '@the-api-builder/registry';
import {
  filterExternals,
  pipe,
  RoutesFolderName,
} from '@the-api-builder/utils';
import * as fs from 'fs';
import { ensureDir, writeJSON } from 'fs-extra';
import { dirname, join, resolve } from 'path';
import { promisify } from 'util';
import webpack from 'webpack';

import { Context } from '../Context';
import common from '../webpack/common.config';

const buildRouters: Stage<Context> = async (ctx) => {
  const { routes, outFs, ufs, api, routersPaths, argv } = ctx;
  const externals = ['webpack', ...api.externals];
  const { output } = api;
  const outDir = resolve(process.cwd(), output);
  const routersOutDir = join(outDir, RoutesFolderName);
  let { version } = argv;

  if (!version) {
    const time = new Date();
    version = `${time.getFullYear()}${
      time.getMonth() + 1
    }${time.getDate()}${time.getHours()}${time.getMinutes()}`;
  }

  await ensureDir(routersOutDir);

  for await (const routerPath of routersPaths) {
    const endpoint = dirname(routerPath);
    const route = routes[endpoint];
    const artifactName = `${route.name}-${version}`;
    const routerPackageJson: any = {
      name: artifactName,
      dependencies: {},
    };
    const compilerConfig = common({
      entry: resolve(process.cwd(), RoutesFolderName, routerPath),
      output: '/build',
      filename: `${route.name}.js`,
      externals: filterExternals(externals, ctx.package, routerPackageJson),
    });
    const compiler = webpack(compilerConfig);
    const run = promisify(compiler.run).bind(compiler);

    compiler.inputFileSystem = ufs;
    compiler.outputFileSystem = outFs;

    const stats = await run();

    if (stats?.hasErrors()) {
      console.error(stats.toJson({ errors: true }).errors);
      process.exit(1);
    }

    await ensureDir(join(routersOutDir, artifactName));

    await pipe(
      outFs.createReadStream(join('/build', `${route.name}.js`)),
      fs.createWriteStream(join(routersOutDir, artifactName, 'index.js'))
    );
    await writeJSON(
      join(routersOutDir, artifactName, 'package.json'),
      routerPackageJson,
      {
        spaces: 2,
      }
    );
  }
};

export default buildRouters;
