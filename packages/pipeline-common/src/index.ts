import { Pipeline } from '@the-api-builder/registry';

import { ActionConfig } from './ActionConfig';
import { ApiConfig } from './ApiConfig';
import Context from './Context';
import RouterConfig from './RouterConfig';
import Routes from './Routes';
import buildOpenApi from './stages/buildOpenApi';
import isDev from './stages/isDev';
import loadApiConfig from './stages/loadApiConfig';
import loadMemFs from './stages/loadMemFs';
import loadPackage from './stages/loadPackage';
import loadRoutes from './stages/loadRoutes';
import loadRoutesSchemas from './stages/loadRoutesSchemas';
import { Statement } from './Statement';

const pipeline = new Pipeline<Context>();

pipeline.add('isDev', isDev);
pipeline.add('package', loadPackage);
pipeline.add('apiConfig', loadApiConfig);
pipeline.add('memFs', loadMemFs);
pipeline.add('routes', loadRoutes);
pipeline.add('routesSchemas', loadRoutesSchemas);
pipeline.add('openApi', buildOpenApi);

export * from './SupportedHttpMethods';
export { ActionConfig, ApiConfig, Context, RouterConfig, Routes, Statement };
export default pipeline;
