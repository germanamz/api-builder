import wpBuild, { outfs } from './wpBuild';

async function getRouteModule(path: string, id: string) {
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

export default getRouteModule;
