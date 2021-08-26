import { ApiConfig } from './ApiConfig';

export interface Mod {
  str: string;
  fn: Function;
  module: {
    getActionConfig: () => any;
    policyStatements: () => any[];
    default: (event: any, ctx: any) => Promise<any> | ApiConfig;
  };
}
