import RouterConfig from './RouterConfig';
import type { SupportedHttpMethodsSet } from './SupportedHttpMethods';

export type Route = {
  methods: SupportedHttpMethodsSet[];
  config?: RouterConfig;
  name: string;
};

type Routes = {
  [path: string]: Route;
};

export default Routes;
