import buildRouters from '../middlewares/build/buildRouters';
import buildTerraform from '../middlewares/build/buildTerraform';
import prepareRouters from '../middlewares/build/prepareRouters';
import CommonPipeline from './CommonPipeline';

const BuildPipeline = [
  ...CommonPipeline,
  prepareRouters,
  buildRouters,
  buildTerraform,
];

export default BuildPipeline;
