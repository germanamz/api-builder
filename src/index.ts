import build from './actions/build';
import bundleRouters from './middlewares/bundleRouters';
import getAwsConfig from './middlewares/getAwsConfig';
import getOpenApiSchema from './middlewares/getOpenApiSchema';
import getPackageJsonData from './middlewares/getPackageJsonData';
import loadApiConfig from './middlewares/loadApiConfig';
import prepareRoutes from './middlewares/prepareRoutes';
import prepareTerraform from './middlewares/prepareTerraform';
import registry from './registry';

const commonMiddlewares = [
  getPackageJsonData,
  loadApiConfig,
  getAwsConfig,
  prepareRoutes,
  bundleRouters,
  getOpenApiSchema,
  prepareTerraform,
];

registry.register('build', ...commonMiddlewares, build);

export { build };
export default registry;
