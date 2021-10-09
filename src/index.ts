/* eslint-disable import/first */
require('ts-node').register({
  project: `${process.cwd()}/tsconfig.json`,
});

import BuildPipeline from './pipelines/BuildPipeline';
import DevPipeline from './pipelines/DevPipeline';
import registryFactory from './registry';
import { ApiConfig } from './types/ApiConfig';
import BuildPipelineArgv from './types/argvs/BuildPipelineArgv';
import DevPipelineArgv from './types/argvs/DevPipelineArgv';
import genApiError from './utils/genApiError';

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

const pipelines = {
  build: BuildPipeline,
  dev: DevPipeline,
};

export type DefaultPipelines = keyof typeof pipelines;

const registry = registryFactory<{
  build: BuildPipelineArgv;
  dev: DevPipelineArgv;
}>(pipelines);

export { ApiConfig, genApiError };
export default registry;
