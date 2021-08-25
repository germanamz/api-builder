import { createFsFromVolume, Volume } from 'memfs';
import { join } from 'path';
import { promisify } from 'util';
import webpack from 'webpack';

import commonConfig from './config/common.config';

const output = '/build';

export const vol = new Volume();

export const outfs = createFsFromVolume(vol);

async function wpBuild(entry: string, filename: string) {
  const config = commonConfig({
    output,
    filename,
    entry,
  });
  const compiler = webpack(config);

  const run = promisify(compiler.run).bind(compiler);

  compiler.outputFileSystem = outfs;

  return {
    absPath: join(output, filename),
    stats: await run(),
  };
}

export default wpBuild;
