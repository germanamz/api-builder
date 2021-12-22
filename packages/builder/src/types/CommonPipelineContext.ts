import { BasicContext } from '@the-api-builder/registry';
import { IFs } from 'memfs';
import { IUnionFs } from 'unionfs';

import { ApiConfig } from './ApiConfig';
import Routes from './Routes';

type CommonPipelineContext = BasicContext & {
  package: any;
  isDev: boolean;
  api: ApiConfig;
  ufs: IUnionFs;
  inFs: IFs;
  outFs: IFs;
  routes: Routes;
  openapi: any;
};

export default CommonPipelineContext;
