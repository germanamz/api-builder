import Registry from '@the-api-builder/registry';

import BuildPipeline from './pipelines/BuildPipeline';
import DevPipeline from './pipelines/DevPipeline';
import { ApiConfig } from './types/ApiConfig';
import BuildPipelineContext from './types/BuildPipelineContext';
import CommonPipelineContext from './types/CommonPipelineContext';
import DevPipelineContext from './types/DevPipelineContext';

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
export type { default as Context } from './types/Context';
export type { Handler } from './types/Handler';
export type { default as HandlerContext } from './types/HandlerContext';
export type { PreparedApiGatewayProxyEvent } from './types/PreparedApiGatewayProxyEvent';
export type { default as RouterConfig } from './types/RouterConfig';
export type { Statement } from './types/Statement';

type ApiBuilderContext = CommonPipelineContext &
  BuildPipelineContext &
  DevPipelineContext;

const registry = new Registry<ApiBuilderContext>();

registry.register('build', BuildPipeline);
registry.register('dev', DevPipeline);

export { ApiConfig };
export default registry;
