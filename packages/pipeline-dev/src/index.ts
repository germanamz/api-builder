import CommonPipeline from '@the-api-builder/pipeline-common';
import { Pipeline } from '@the-api-builder/registry';

import Context from './Context';
import runRest from './stages/runRest';
import runWs from './stages/runWs';

const pipeline = new Pipeline<Context>();

pipeline.add('runRest', runRest);
pipeline.add('runWs', runWs);

export { Context };
export default Pipeline.concat<Context>(CommonPipeline, pipeline);
