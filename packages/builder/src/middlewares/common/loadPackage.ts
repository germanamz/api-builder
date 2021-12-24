import { genError } from '@the-api-builder/errno';
import { BuilderErrors } from '@the-api-builder/errors';
import { Stage } from '@the-api-builder/registry';
import { pathExists, readJSON } from 'fs-extra';
import { join } from 'path';

import CommonPipelineContext from '../../types/CommonPipelineContext';

const loadPackage: Stage<CommonPipelineContext> = async () => {
  const path = join(process.cwd(), 'package.json');

  if (!(await pathExists(path))) {
    throw genError(BuilderErrors.PACKAGE_NOT_FOUND);
  }

  return {
    package: await readJSON(path),
  };
};

export default loadPackage;
