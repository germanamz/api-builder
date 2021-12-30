import CommonPipeline from '@the-api-builder/pipeline-common';
import { Pipeline } from '@the-api-builder/registry';

import Context from './Context';
import buildRouters from './stages/buildRouters';
import buildTerraform from './stages/buildTerraform';
import prepareRouters from './stages/prepareRouters';

const pipeline = new Pipeline<Context>();

pipeline.add('prepareRouters', prepareRouters);
pipeline.add('buildRouters', buildRouters);
pipeline.add('buildTerraform', buildTerraform);

export { Context };
export default Pipeline.concat<Context>(CommonPipeline, pipeline);
