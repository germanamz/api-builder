import { BuilderErrors } from '@the-api-builder/errors';
import { Stage } from '@the-api-builder/registry';
import { getConfig } from '@the-api-builder/utils';
import { join } from 'path';

import { ApiConfig } from '../ApiConfig';
import Context from '../Context';

const loadApiConfig: Stage<Context> = async (ctx) => ({
  api: (await getConfig<ApiConfig>(
    ctx as any,
    [join(process.cwd(), '.api.js'), join(process.cwd(), '.api.json')],
    BuilderErrors.API_CONFIG_NOT_FOUND
  )) as ApiConfig,
});

export default loadApiConfig;
