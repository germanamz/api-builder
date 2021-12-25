import CommonPipeline from '@the-api-builder/pipeline-common';
import { Pipeline } from '@the-api-builder/registry';

import Context from './Context';
import runDev from './stages/runDev';

const pipeline = new Pipeline<Context>();

pipeline.add('runDev', runDev);

export { Context };
export default Pipeline.concat<Context>(CommonPipeline, pipeline);
