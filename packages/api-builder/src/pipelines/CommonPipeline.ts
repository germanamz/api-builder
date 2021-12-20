import buildOpenApi from '../middlewares/common/buildOpenApi';
import loadApiConfig from '../middlewares/common/loadApiConfig';
import loadMemFs from '../middlewares/common/loadMemFs';
import loadPackage from '../middlewares/common/loadPackage';
import loadRoutes from '../middlewares/common/loadRoutes';
import loadRoutesSchemas from '../middlewares/common/loadRoutesSchemas';

const CommonPipeline = [
  loadPackage,
  loadApiConfig,
  loadMemFs,
  loadRoutes,
  loadRoutesSchemas,
  buildOpenApi,
];

export default CommonPipeline;
