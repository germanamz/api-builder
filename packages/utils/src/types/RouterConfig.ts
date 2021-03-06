import { SupportedHttpMethodsSet } from '../constants/SupportedHttpMethods';
import { ActionConfig } from './ActionConfig';
import { Statement } from './Statement';

export type RouterConfig = {
  schemas?: {
    [key: string]: any;
  };
  variables: {
    [key: string]: string;
  };
  actionConfig: {
    [method in SupportedHttpMethodsSet]?: ActionConfig;
  };
  policyStatements: Statement[];
};
