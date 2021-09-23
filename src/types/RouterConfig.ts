import { ActionConfig } from './ActionConfig';
import { Statement } from './Statement';
import SupportedHttpMethods from './SupportedHttpMethods';

type RouterConfig = {
  variables: {
    [key: string]: string;
  };
  actionConfig: {
    [method in SupportedHttpMethods]: ActionConfig;
  };
  policyStatements: Statement[];
};

export default RouterConfig;
