import { IFs } from 'memfs';
import { IUnionFs } from 'unionfs';

import { ApiConfig } from './ApiConfig';
import Routes from './Routes';

type Context = {
  ufs: IUnionFs;
  inFs: IFs;
  outFs: IFs;
  api: ApiConfig;
  package: any;
  routes: Routes;
  openapi: any;
  routersPaths: string[];
  isDev: boolean;
};

export default Context;
