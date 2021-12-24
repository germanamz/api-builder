import { Context as CommonPipelineContext } from '@the-api-builder/pipeline-common';

type BuildPipelineContext = CommonPipelineContext & {
  routersPaths: string[];
};

export default BuildPipelineContext;
