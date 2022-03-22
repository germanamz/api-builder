import PipelineBuildRest from '@the-api-builder/pipeline-build-rest';
import CommonPipeline from '@the-api-builder/pipeline-common';
import { Pipeline } from '@the-api-builder/registry';

import Context from './Context';

export { Context };
export default Pipeline.concat<Context>(CommonPipeline, PipelineBuildRest);
