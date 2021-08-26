import archiver from 'archiver';
import { mapSeries, reduce } from 'bluebird';
import { createHash } from 'crypto';
import {
  createReadStream,
  createWriteStream,
  ensureDir,
  outputFile,
} from 'fs-extra';
import { join } from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';

import { MiddlewareContext } from '../registry';
import wpBuild, { outfs } from '../webpack/wpBuild';

const pipe = promisify(pipeline);

async function bundleRouters(ctx: MiddlewareContext) {
  const { paths, routes, argv, api } = ctx;
  const tempDir = await join(process.cwd(), 'temp');
  const outputPath = join(process.cwd(), 'dist');
  let routers = await mapSeries(paths, async (path) => {
    const statements: any[] = [];
    const handlers = await reduce(
      Object.values(routes[path]),
      async (handlersAcc, apiRoute) => {
        const routeStatements = apiRoute.module.module.policyStatements
          ? apiRoute.module.module.policyStatements()
          : [];
        statements.push(...routeStatements);
        return {
          ...handlersAcc,
          [apiRoute.method]: apiRoute.module.fn.toString(),
        };
      },
      {}
    );
    const handlerStr: string = Object.entries<string>(handlers)
      .reduce(
        (acc: string[], [method, methodHandler]) => [
          ...acc,
          `${method}: ((${methodHandler})()).default`,
        ],
        []
      )
      .join(',');
    const routerStr = `const handlers: any = {${handlerStr}};
export async function handler(event: { httpMethod: string }) {
  const { httpMethod } = event;
  const method = httpMethod.toLowerCase();
  const methodHandler = handlers[method] || (() => ({}));

  return methodHandler(event);
}`;

    const basename = path.replace(/\//g, '-').replace(/[{}]/g, '');
    const routerFilePath = join(tempDir, `${basename}.ts`);

    await outputFile(routerFilePath, routerStr);
    const { absPath }: any = await wpBuild(routerFilePath, basename);

    return {
      path,
      basename,
      outFsAbsPath: absPath,
      statements,
    };
  });

  await ensureDir(outputPath);
  routers = await mapSeries(routers, async (router) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const lambdaName = `${api.name || 'api'}-${router.basename}-${
      argv.env || 'dev'
    }`;
    const artifact = `${lambdaName}-${argv.tag || 'dev'}`;
    const zipFilePath = join(outputPath, `${artifact}.zip`);
    const outZip = createWriteStream(zipFilePath);

    archive.append(outfs.createReadStream(router.outFsAbsPath), {
      name: 'index.js',
    });
    await archive.finalize();
    await pipe(archive, outZip);

    const hash = createHash('sha256');
    const checksumFilePath = `${zipFilePath}.checksum`;

    hash.setEncoding('base64');
    await pipe(
      createReadStream(zipFilePath),
      hash,
      createWriteStream(checksumFilePath)
    );

    return {
      ...router,
      lambdaName,
      artifact,
      zipFilePath,
      checksumFilePath,
    };
  });

  return { routers };
}

export default bundleRouters;
