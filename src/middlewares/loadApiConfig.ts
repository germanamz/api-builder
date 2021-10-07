import { join, resolve } from 'path';

import BuilderErrors from '../errors/BuilderErrors';
import getConfig from '../helpers/getConfig';
import { ApiConfig } from '../types/ApiConfig';
import Context from '../types/Context';
import Middleware from '../types/Middleware';

const loadApiConfig: Middleware<keyof Context, 'api'> = async (ctx) => ({
  api: (await getConfig<ApiConfig>(
    ctx,
    join(process.cwd(), '.api.js'),
    join(process.cwd(), '.api.json'),
    BuilderErrors.API_CONFIG_NOT_FOUND,
    {
      externals: [resolve(process.cwd(), 'node_modules')],
    }
  )) as ApiConfig,
});

export default loadApiConfig;
