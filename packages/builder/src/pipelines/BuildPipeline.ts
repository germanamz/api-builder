import CommonPipeline from '@the-api-builder/pipeline-common';
import { Pipeline } from '@the-api-builder/registry';

import buildRouters from '../middlewares/build/buildRouters';
import buildTerraform from '../middlewares/build/buildTerraform';
import prepareRouters from '../middlewares/build/prepareRouters';
import BuildPipelineContext from '../types/BuildPipelineContext';

const pipeline = new Pipeline<BuildPipelineContext>();

pipeline.add('prepareRouters', prepareRouters);
pipeline.add('buildRouters', buildRouters);
pipeline.add('buildTerraform', buildTerraform);

export default Pipeline.concat<BuildPipelineContext>(CommonPipeline, pipeline);
