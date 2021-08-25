import { readJson } from 'fs-extra';
import { resolve } from 'path';

let packageJson: any;

async function getPackageJsonData() {
  if (packageJson) {
    return packageJson;
  }
  const packageFile = resolve(process.cwd(), 'package.json');

  packageJson = await readJson(packageFile);

  return {
    packageJson,
  };
}

export default getPackageJsonData;
