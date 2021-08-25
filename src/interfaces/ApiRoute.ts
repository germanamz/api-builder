import { KnownMethods } from '../constants/KnownMethods';
import { RouteModule } from './RouteModule';

export interface ApiRoute {
  id: string;
  path: string;
  absPath: string;
  route: string;
  method: KnownMethods;
  params: string[];
  module: RouteModule;
}
