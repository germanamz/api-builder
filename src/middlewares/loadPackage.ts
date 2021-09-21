import { pathExists, readJSON } from 'fs-extra';
import { join } from 'path';

import BuilderErrors, { genBuilderError } from '../errors/BuilderErrors';
import Middleware from '../types/Middleware';

const loadPackage: Middleware<null, 'package'> = async () => {
  const path = join(process.cwd(), 'package.json');

  if (!(await pathExists(path))) {
    throw genBuilderError(BuilderErrors.PACKAGE_NOT_FOUND);
  }

  return {
    package: await readJSON(path),
  };
};

export default loadPackage;
