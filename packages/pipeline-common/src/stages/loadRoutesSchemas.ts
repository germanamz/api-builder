import { Stage } from '@the-api-builder/registry';

import Context from '../Context';

const loadRoutesSchemas: Stage<Context> = async (ctx) => {
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
