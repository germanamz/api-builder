import archiver from 'archiver';
import { createHash } from 'crypto';
import ejs from 'ejs';
import * as fs from 'fs';
import { ensureDir, readFile } from 'fs-extra';
import { join, resolve } from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import webpack, { Stats } from 'webpack';

import CommonArgv from '../types/CommonArgv';
import Context from '../types/Context';
import Middleware from '../types/Middleware';
import routerConfig from '../webpack/config/router.config';

export type BuildRoutersArgv = CommonArgv & {
  routesOutput?: string;
};

const pipe = promisify(pipeline);

const buildRouters: Middleware<keyof Context, null, BuildRoutersArgv> = async (
  ctx,
  argv
) => {
  const { routesOutput, version } = argv;
  const { routes, outFs, inFs, ufs, api } = ctx;
  const template = ejs.compile(
    await readFile(resolve(__dirname, '../templates/router.ts.ejs'), 'utf8')
  );
  const outdir = resolve(process.cwd(), routesOutput || api.routesOutput);

  await ensureDir(outdir);
  await ensureDir(join(outdir, 'routers'));

  for await (const endpoint of Object.keys(routes)) {
    const { name } = routes[endpoint];
    const entryDirPath = resolve(process.cwd(), 'routes', endpoint);
    const entry = join(entryDirPath, 'index.ts');

    await inFs.promises.mkdir(entryDirPath, { recursive: true });
    inFs.writeFileSync(entry, template(routes[endpoint]));

    const config = routerConfig({
      output: '/build',
      filename: 'index.js',
      entry,
      context: entryDirPath,
      externals: api.externals,
    });
    const compiler = webpack(config);
    const run = promisify(compiler.run).bind(compiler);

    compiler.inputFileSystem = ufs;
    compiler.outputFileSystem = outFs;

    const stats = (await run()) as Stats;

    if (stats.hasErrors()) {
      console.log(stats.toJson({ errors: true }).errors);
      process.exit(1);
    }

    const lambdaArchive = archiver('zip');
    const zipFilePath = resolve(outdir, `routers/${name}-${version}.zip`);

    lambdaArchive.pipe(fs.createWriteStream(zipFilePath));
    lambdaArchive.append(outFs.createReadStream('/build/index.js'), {
      name: 'index.js',
    });

    await lambdaArchive.finalize();

    const checksumFilePath = `${zipFilePath}.checksum`;

    await pipe(
      fs.createReadStream(zipFilePath),
      createHash('sha256').setEncoding('base64'),
      fs.createWriteStream(checksumFilePath)
    );
  }

  const dependenciesPath = join(outdir, `deps-${version}.zip`);
  const dependenciesArchive = archiver('zip');

  dependenciesArchive.pipe(fs.createWriteStream(dependenciesPath));

  dependenciesArchive.directory(
    resolve(process.cwd(), 'node_modules'),
    'nodejs/node_modules'
  );

  if (api.externals) {
    api.externals.forEach((externalPath) => {
      dependenciesArchive.directory(externalPath, 'nodejs/node_modules');
    });
  }

  await dependenciesArchive.finalize();

  await pipe(
    fs.createReadStream(dependenciesPath),
    createHash('sha256').setEncoding('base64'),
    fs.createWriteStream(`${dependenciesPath}.checksum`)
  );
};

export default buildRouters;
