import RouterConfig from './RouterConfig';
import SupportedHttpMethods from './SupportedHttpMethods';

export type Route = {
  methods: SupportedHttpMethods[];
  config?: RouterConfig;
  name: string;
};

type Routes = {
  [path: string]: Route;
};

export default Routes;
