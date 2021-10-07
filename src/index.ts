import buildOpenApi from './middlewares/buildOpenApi';
import buildRouters from './middlewares/buildRouters';
import buildTerraform from './middlewares/buildTerraform';
import loadApiConfig from './middlewares/loadApiConfig';
import loadMemFs from './middlewares/loadMemFs';
import loadPackage from './middlewares/loadPackage';
import loadRoutes from './middlewares/loadRoutes';
import prepareRouters from './middlewares/prepareRouters';
import runDev from './middlewares/runDev';
import setDev from './middlewares/setDev';
import registry from './registry';
import { ApiConfig } from './types/ApiConfig';
import genApiError from './utils/genApiError';
import handlerWrapper from './utils/handlerWrapper';

export type {
  ActionConfig,
  MediaType,
  Parameter,
  RefObj,
  RequestBody,
} from './types/ActionConfig';
export type { default as ApiError } from './types/ApiError';
export type { default as ApiErrorStatuses } from './types/ApiErrorStatuses';
export type { ApiGatewayProxyEvent } from './types/ApiGatewayProxyEvent';
export type { ApiGatewayProxyResponse } from './types/ApiGatewayProxyResponse';
export type { Handler } from './types/Handler';
export type { default as HandlerContext } from './types/HandlerContext';
export type { Statement } from './types/Statement';

const commonMiddlewares = [loadPackage, loadApiConfig, loadMemFs, loadRoutes];

registry.register('build-routers', ...commonMiddlewares, buildRouters);
registry.register('build-openapi', ...commonMiddlewares, buildOpenApi);
registry.register('build-terraform', ...commonMiddlewares, buildTerraform);
registry.register(
  'build',
  ...commonMiddlewares,
  buildRouters,
  buildOpenApi,
  buildTerraform
);
registry.register(
  'dev',
  setDev,
  ...commonMiddlewares,
  buildOpenApi,
  prepareRouters,
  runDev
);

export { ApiConfig, genApiError, handlerWrapper };
export default registry;
