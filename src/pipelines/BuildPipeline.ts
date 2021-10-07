import buildRouters from '../middlewares/build/buildRouters';
import buildTerraform from '../middlewares/build/buildTerraform';
import CommonPipeline from './CommonPipeline';

const BuildPipeline = [...CommonPipeline, buildRouters, buildTerraform];

export default BuildPipeline;
