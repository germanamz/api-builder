import { Mod } from '../interfaces/Mod';
import wpBuild, { outfs } from './wpBuild';

async function loadModule(path: string, id: string): Promise<Mod> {
  const { absPath } = await wpBuild(path, id);
  const fileContent = await outfs.promises.readFile(absPath);
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const fn = new Function(
    `const exports = {};const module = true;const define = true; ${fileContent.toString()} return exports;`
  );

  return {
    str: fileContent.toString(),
    fn,
    module: fn(),
  };
}

export default loadModule;
