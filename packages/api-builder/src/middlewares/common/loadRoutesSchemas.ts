import Context from '../../types/Context';
import Middleware from '../../types/Middleware';

const loadRoutesSchemas: Middleware<keyof Context, 'api'> = async (ctx) => {
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
