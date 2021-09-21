import RouterConfig from './RouterConfig';
import SupportedHttpMethods from './SupportedHttpMethods';

type Routes = {
  [path: string]: {
    methods: SupportedHttpMethods[];
    config?: RouterConfig;
    name: string;
  };
};

export default Routes;
