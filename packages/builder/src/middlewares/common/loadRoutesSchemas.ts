import { Stage } from '@the-api-builder/registry';

import CommonPipelineContext from '../../types/CommonPipelineContext';

const loadRoutesSchemas: Stage<CommonPipelineContext> = async (ctx) => {
  const { routes, api } = ctx;

  api.schemas = Object.values(routes).reduce(
    (acc, config) => ({
      ...acc,
      ...(config.config?.schemas || {}),
    }),
    api.schemas
  );

  return {
    api,
  };
};

export default loadRoutesSchemas;
