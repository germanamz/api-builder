import { ActionConfig } from './ActionConfig';
import { Statement } from './Statement';
import SupportedHttpMethods from './SupportedHttpMethods';

type RouterConfig = {
  actionConfig: {
    [method in SupportedHttpMethods]: ActionConfig;
  };
  policyStatements: Statement[];
};

export default RouterConfig;
