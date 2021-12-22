import { Pipeline } from '@the-api-builder/registry';

import runDev from '../middlewares/dev/runDev';
import DevPipelineContext from '../types/DevPipelineContext';
import CommonPipeline from './CommonPipeline';

const pipeline = new Pipeline<DevPipelineContext>();

pipeline.add('runDev', runDev);

export default Pipeline.concat<DevPipelineContext>(CommonPipeline, pipeline);
