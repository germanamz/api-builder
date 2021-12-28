import BuildPipeline, {
  Context as BuildPipelineContext,
} from '@the-api-builder/pipeline-build';
import { Context as CommonPipelineContext } from '@the-api-builder/pipeline-common';
import DevPipeline, {
  Context as DevPipelineContext,
} from '@the-api-builder/pipeline-dev';
import Registry from '@the-api-builder/registry';

type Context = CommonPipelineContext &
  BuildPipelineContext &
  DevPipelineContext;

const registry = new Registry<Context>();

registry.register('build', BuildPipeline);
registry.register('dev', DevPipeline);

export { Context };
export default registry;
