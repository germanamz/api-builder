import { Pipeline } from '@the-api-builder/registry';

import buildRouters from '../middlewares/build/buildRouters';
import buildTerraform from '../middlewares/build/buildTerraform';
import prepareRouters from '../middlewares/build/prepareRouters';
import BuildPipelineContext from '../types/BuildPipelineContext';
import CommonPipeline from './CommonPipeline';

const pipeline = new Pipeline<BuildPipelineContext>();

pipeline.add('prepareRouters', prepareRouters);
pipeline.add('buildRouters', buildRouters);
pipeline.add('buildTerraform', buildTerraform);

export default Pipeline.concat<BuildPipelineContext>(CommonPipeline, pipeline);
