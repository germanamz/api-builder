import { BuilderErrors } from '@the-api-builder/errors';
import { Stage } from '@the-api-builder/registry';
import { ApiConfig, getConfig } from '@the-api-builder/utils';
import { join } from 'path';

import Context from '../Context';

const loadApiConfig: Stage<Context> = async (ctx) => ({
  api: {
    output: './dist',
    ...((await getConfig<Context, ApiConfig>(
      ctx,
      [
        join(process.cwd(), '.api.js'),
        join(process.cwd(), '.api.ts'),
        join(process.cwd(), '.api.json'),
      ],
      BuilderErrors.API_CONFIG_NOT_FOUND
    )) as any),
  },
});

export default loadApiConfig;
