import build from './actions/build';
import { ApiConfig } from './interfaces/ApiConfig';
import bundleRouters from './middlewares/bundleRouters';
import getAwsConfig from './middlewares/getAwsConfig';
import getOpenApiSchema from './middlewares/getOpenApiSchema';
import getPackageJsonData from './middlewares/getPackageJsonData';
import loadApiConfig from './middlewares/loadApiConfig';
import prepareRoutes from './middlewares/prepareRoutes';
import prepareTerraform from './middlewares/prepareTerraform';
import registry from './registry';
import handlerWrapper from './utils/handlerWrapper';

export type {
  ActionConfig,
  MediaType,
  Parameter,
  RefObj,
  RequestBody,
} from './interfaces/ActionConfig';
export type { default as ApiError } from './interfaces/ApiError';
export type { ApiGatewayProxyEvent } from './interfaces/ApiGatewayProxyEvent';
export type { ApiGatewayProxyResponse } from './interfaces/ApiGatewayProxyResponse';
export type { GetActionConfigFn } from './interfaces/GetActionConfigFn';
export type { Handler } from './interfaces/Handler';
export type { PolicyStatementsFn } from './interfaces/PolicyStatementsFn';
export type { Statement } from './interfaces/Statement';

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

export { ApiConfig, build, handlerWrapper };
export default registry;
