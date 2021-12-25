import { Pipeline } from '@the-api-builder/registry';

import Context from './Context';
import buildOpenApi from './stages/buildOpenApi';
import isDev from './stages/isDev';
import loadApiConfig from './stages/loadApiConfig';
import loadMemFs from './stages/loadMemFs';
import loadPackage from './stages/loadPackage';
import loadRoutes from './stages/loadRoutes';
import loadRoutesSchemas from './stages/loadRoutesSchemas';

const pipeline = new Pipeline<Context>();

pipeline.add('isDev', isDev);
pipeline.add('package', loadPackage);
pipeline.add('apiConfig', loadApiConfig);
pipeline.add('memFs', loadMemFs);
pipeline.add('routes', loadRoutes);
pipeline.add('routesSchemas', loadRoutesSchemas);
pipeline.add('openApi', buildOpenApi);

export { Context };
export default pipeline;
