import type { SupportedHttpMethodsSet } from '../constants/SupportedHttpMethods';
import RouterConfig from './RouterConfig';

export type Route = {
  methods: SupportedHttpMethodsSet[];
  config?: RouterConfig;
  name: string;
};

type Routes = {
  [path: string]: Route;
};

export default Routes;
