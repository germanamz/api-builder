import prepareRouters from '../middlewares/common/prepareRouters';
import runDev from '../middlewares/dev/runDev';
import setDev from '../middlewares/dev/setDev';
import CommonPipeline from './CommonPipeline';

const DevPipeline = [setDev, ...CommonPipeline, prepareRouters, runDev];

export default DevPipeline;
