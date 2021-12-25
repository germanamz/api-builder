import { BasicContext } from '@the-api-builder/registry';
import { ApiConfig, Routes } from '@the-api-builder/utils';
import { IFs } from 'memfs';
import { IUnionFs } from 'unionfs';

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
