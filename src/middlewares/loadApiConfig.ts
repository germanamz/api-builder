import { pathExists } from 'fs-extra';
import { join } from 'path';

import loadModule from '../webpack/loadModule';

async function loadApiConfig() {
  const apiConfigPath = join(process.cwd(), '.api.ts');
  const apiConfigExists = await pathExists(apiConfigPath);
  const defaultConfig = { api: { schemas: {} } };

  if (!apiConfigExists) {
    return defaultConfig;
  }

  const apiConfig = await loadModule(apiConfigPath, '.api.js');

  return { api: { ...defaultConfig, ...apiConfig.module.default } };
}

export default loadApiConfig;
