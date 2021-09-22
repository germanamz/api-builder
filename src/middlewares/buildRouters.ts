import archiver from 'archiver';
import { createHash } from 'crypto';
import dependencyTree from 'dependency-tree';
import ejs from 'ejs';
import * as fs from 'fs';
import { copy, ensureDir, readFile } from 'fs-extra';
import { builtinModules } from 'module';
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
  zip?: boolean;
};

const pipe = promisify(pipeline);

const buildRouters: Middleware<keyof Context, null, BuildRoutersArgv> = async (
  ctx,
  argv
) => {
  const { routesOutput, version, zip } = argv;
  const { routes, outFs, inFs, ufs, api } = ctx;
  const template = ejs.compile(
    await readFile(resolve(__dirname, '../templates/router.ts.ejs'), 'utf8')
  );
  const outdir = resolve(process.cwd(), routesOutput || api.routesOutput);
  const routersOutdir = join(outdir, 'routers');

  await ensureDir(routersOutdir);

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

    const artifactName = `${api.name}-${name}-${version}`;
    const artifactDir = join(routersOutdir, artifactName);
    const artifactIndexFile = join(artifactDir, 'index.js');

    await ensureDir(artifactDir);
    await pipe(
      outFs.createReadStream('/build/index.js'),
      fs.createWriteStream(artifactIndexFile)
    );

    const deps = dependencyTree.toList({
      filename: artifactIndexFile,
      directory: process.cwd(),
    });
    const sourceDepsPath = join(process.cwd(), 'node_modules');
    const artifactDepsPath = join(artifactDir, 'node_modules');
    const copiedModules: any = {};

    await ensureDir(artifactDepsPath);
    for await (const depPath of deps) {
      if (depPath.indexOf(sourceDepsPath) !== -1) {
        const moduleRegex = new RegExp(
          `${sourceDepsPath.replace(/\//g, '\\/')}\\/([@\\w-]+)`
        );
        const moduleMatch = depPath.match(moduleRegex);

        if (moduleMatch) {
          const [, moduleName] = moduleMatch;

          if (
            !copiedModules[moduleName] &&
            builtinModules.indexOf(moduleName) === -1
          ) {
            await copy(
              join(sourceDepsPath, moduleName),
              join(artifactDepsPath, moduleName)
            );
            copiedModules[moduleName] = true;
          }
        }
      }
    }

    if (zip) {
      const archivePath = join(outdir, 'zip', `${artifactName}.zip`);
      const archiveChecksumPath = `${archivePath}.checksum`;
      const archive = archiver('zip');

      archive.pipe(fs.createWriteStream(archivePath));
      archive.directory(artifactDir, false);
      await archive.finalize();

      const hash = createHash('sha1');
      await pipe(
        fs.createReadStream(archivePath),
        hash,
        fs.createWriteStream(archiveChecksumPath)
      );
    }
  }
};

export default buildRouters;
