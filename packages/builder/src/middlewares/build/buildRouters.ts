import { Stage } from '@the-api-builder/registry';
import * as fs from 'fs';
import { ensureDir, writeJSON } from 'fs-extra';
import { dirname, join, resolve } from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import webpack from 'webpack';

import BuildPipelineContext from '../../types/BuildPipelineContext';
import common from '../../webpack/config/common.config';

const pipe = promisify(pipeline);

const buildRouters: Stage<BuildPipelineContext> = async (ctx) => {
  const {
    routes,
    outFs,
    ufs,
    api,
    routersPaths,
    package: packageJson,
    argv,
  } = ctx;
  const { version } = argv;
  const externals = ['webpack', ...api.externals];
  const output = argv.output || api.output || 'dist';
  const outDir = resolve(process.cwd(), output);
  const routersOutDir = join(outDir, 'routers');

  await ensureDir(routersOutDir);

  for await (const routerPath of routersPaths) {
    const endpoint = dirname(routerPath);
    const route = routes[endpoint];
    const routerPackageJson: any = {
      name: `${route.name}-${version}`,
      dependencies: {},
    };
    const compilerConfig = common({
      entry: resolve(process.cwd(), 'routes', routerPath),
      output: '/build',
      filename: `${route.name}.js`,
      externals: (externalContext: any, cb: any) => {
        const externalIndex = externals.findIndex(
          (external) => externalContext.request.indexOf(external) === 0
        );

        if (externalIndex !== -1) {
          const external = externals[externalIndex];
          if (packageJson.dependencies[external]) {
            routerPackageJson.dependencies[external] =
              packageJson.dependencies[external];
          }
          cb(null, `commonjs ${externalContext.request}`);
          return;
        }

        cb();
      },
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

    await ensureDir(join(routersOutDir, `${route.name}-${version}`));

    await pipe(
      outFs.createReadStream(join('/build', `${route.name}.js`)),
      fs.createWriteStream(
        join(routersOutDir, `${route.name}-${version}`, 'index.js')
      )
    );
    await writeJSON(
      join(routersOutDir, `${route.name}-${version}`, 'package.json'),
      routerPackageJson,
      {
        spaces: 2,
      }
    );
  }
};

export default buildRouters;
