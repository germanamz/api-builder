import { Context as BuildRestContext } from '@the-api-builder/pipeline-build-rest';
import { Context as CommonPipelineContext } from '@the-api-builder/pipeline-common';

type BuildPipelineContext = CommonPipelineContext & BuildRestContext;

export default BuildPipelineContext;
