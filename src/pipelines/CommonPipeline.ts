import buildOpenApi from '../middlewares/common/buildOpenApi';
import loadApiConfig from '../middlewares/common/loadApiConfig';
import loadMemFs from '../middlewares/common/loadMemFs';
import loadPackage from '../middlewares/common/loadPackage';
import loadRoutes from '../middlewares/common/loadRoutes';

const CommonPipeline = [
  loadPackage,
  loadApiConfig,
  loadMemFs,
  loadRoutes,
  buildOpenApi,
];

export default CommonPipeline;
