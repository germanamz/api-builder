import { BuilderErrors } from '@the-api-builder/errors';
import { Stage } from '@the-api-builder/registry';
import { join } from 'path';

import getConfig from '../../helpers/getConfig';
import { ApiConfig } from '../../types/ApiConfig';
import CommonPipelineContext from '../../types/CommonPipelineContext';

const loadApiConfig: Stage<CommonPipelineContext> = async (ctx) => ({
  api: (await getConfig<ApiConfig>(
    ctx as any,
    join(process.cwd(), '.api.js'),
    join(process.cwd(), '.api.json'),
    BuilderErrors.API_CONFIG_NOT_FOUND,
    {}
  )) as ApiConfig,
});

export default loadApiConfig;
