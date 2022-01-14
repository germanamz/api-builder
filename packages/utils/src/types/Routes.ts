import type { SupportedHttpMethodsSet } from '../constants/SupportedHttpMethods';
import { RouterConfig } from './RouterConfig';

export type Route = {
  methods: SupportedHttpMethodsSet[];
  config?: RouterConfig;
  name: string;
};

export type Routes = {
  [path: string]: Route;
};
