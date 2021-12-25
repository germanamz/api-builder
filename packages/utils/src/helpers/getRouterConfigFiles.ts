import { join } from 'path';

import RouterConfigFiles from '../constants/RouterConfigFiles';

const getRouterConfigFiles = (routerPath: string) =>
  RouterConfigFiles.map((file) => join(routerPath, file));

export default getRouterConfigFiles;
