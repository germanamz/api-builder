import { KnownMethods } from '../constants/KnownMethods';
import { Mod } from './Mod';

export interface ApiRoute {
  id: string;
  path: string;
  absPath: string;
  route: string;
  method: KnownMethods;
  params: string[];
  module: Mod;
}
