import { Pipeline } from '@the-api-builder/registry';

import buildOpenApi from '../middlewares/common/buildOpenApi';
import isDev from '../middlewares/common/isDev';
import loadApiConfig from '../middlewares/common/loadApiConfig';
import loadMemFs from '../middlewares/common/loadMemFs';
import loadPackage from '../middlewares/common/loadPackage';
import loadRoutes from '../middlewares/common/loadRoutes';
import loadRoutesSchemas from '../middlewares/common/loadRoutesSchemas';
import CommonPipelineContext from '../types/CommonPipelineContext';

const pipeline = new Pipeline<CommonPipelineContext>();

pipeline.add('isDev', isDev);
pipeline.add('package', loadPackage);
pipeline.add('apiConfig', loadApiConfig);
pipeline.add('memFs', loadMemFs);
pipeline.add('routes', loadRoutes);
pipeline.add('routesSchemas', loadRoutesSchemas);
pipeline.add('openApi', buildOpenApi);

export default pipeline;
