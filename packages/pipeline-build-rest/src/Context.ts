import { Context as CommonPipelineContext } from '@the-api-builder/pipeline-common';

export type Context = CommonPipelineContext & {
  routersPaths: string[];
};
