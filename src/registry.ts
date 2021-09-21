import { Errno } from '@feprisa/errno';
import { reduce } from 'bluebird';

import Context from './types/Context';
import Middleware from './types/Middleware';

export interface RegistryApi {
  register: (name: string, ...pipeline: Middleware<any, any>[]) => void;
  execute: (actionToExecute: string, argv: any) => Promise<any>;
}

export const registryFactory = (): RegistryApi => {
  const registry: { [name: string]: Middleware<any, any>[] } = {};

  const register = (name: string, ...pipeline: Middleware<any, any>[]) => {
    registry[name] = pipeline;
  };

  const execute = async (
    actionToExecute: string,
    argv: any
  ): Promise<void | Context> => {
    if (!registry[actionToExecute]) {
      throw new Error(`No action ${actionToExecute} found`);
    }
    const pipeline = registry[actionToExecute];

    try {
      return await reduce<Middleware<any, any>, any>(
        pipeline,
        async (ctx, middleware) => ({
          ...ctx,
          ...((await middleware(ctx, argv)) || {}),
        }),
        {}
      );
    } catch (e) {
      if (e instanceof Errno) {
        console.error(e);
        process.exit(1);
      }
      throw e;
    }
  };

  return {
    register,
    execute,
  };
};

export default registryFactory();
