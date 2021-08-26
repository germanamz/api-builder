import { reduce } from 'bluebird';

import { KnownMethods } from './constants/KnownMethods';
import { prepareToUseHooks } from './dispatch';
import { ApiConfig } from './interfaces/ApiConfig';
import { ApiRoute } from './interfaces/ApiRoute';
import { Router } from './interfaces/Router';

export type MiddlewareContext = {
  argv: any;
  packageJson: any;
  aws: { region: string; accountId: string };
  routes: { [path: string]: { [method in KnownMethods]: ApiRoute } };
  paths: string[];
  schema: any;
  routers: Router[];
  api: ApiConfig;
  terraform: {
    tf: string;
    tfvars?: string;
  };
};
type MiddlewareFn = (ctx: MiddlewareContext) => Promise<any>;
type MiddlewarePipeline = Array<MiddlewareFn>;
type ActionRegistryType = { [action: string]: MiddlewarePipeline };

export interface RegistryApi {
  register: (name: string, ...pipeline: MiddlewareFn[]) => void;
  execute: (actionToExecute: string, argv: any) => Promise<any>;
}

export const registryFactory = (): RegistryApi => {
  const registry: ActionRegistryType = {};

  const register = (name: string, ...pipeline: MiddlewarePipeline) => {
    registry[name] = pipeline;
  };

  const execute = async (actionToExecute: string, argv: any) => {
    if (!registry[actionToExecute]) {
      throw new Error(`No action ${actionToExecute} found`);
    }
    const pipeline = registry[actionToExecute];

    const res = await reduce<MiddlewareFn, any>(
      pipeline,
      async (ctx, middleware) =>
        prepareToUseHooks({ ...ctx, ...(await middleware(ctx)) }),
      prepareToUseHooks({ argv })
    );

    prepareToUseHooks(null);

    return res;
  };

  return {
    register,
    execute,
  };
};

export default registryFactory();
