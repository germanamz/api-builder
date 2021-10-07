import { reduce } from 'bluebird';

import CommonPipelineArgv from './types/argvs/CommonPipelineArgv';
import Context from './types/Context';
import Middleware from './types/Middleware';

export type RegistryArgv<P> = {
  [name in keyof P]: CommonPipelineArgv;
};

export interface RegistryApi<P> {
  register: (
    name: keyof P,
    ...pipeline: Middleware<any, any, P[typeof name]>[]
  ) => void;
  execute: (name: keyof P, argv: P[typeof name]) => Promise<any>;
}

export type Registry<P> = {
  [name in keyof P]: Middleware<any, any, P[keyof P]>[];
};

const registryFactory = <P extends RegistryArgv<P>>(
  pipelines?: Registry<P>
): RegistryApi<P> => {
  const registry: Registry<P> = pipelines || ({} as Registry<P>);

  const register = (
    name: keyof P,
    ...pipeline: Middleware<any, any, P[typeof name]>[]
  ) => {
    registry[name] = pipeline;
  };

  const execute = async (name: keyof P, argv: any): Promise<void | Context> => {
    if (!registry[name]) {
      throw new Error(`No pipeline ${name} found`);
    }
    const pipeline = registry[name];

    let res;
    try {
      res = await reduce(
        pipeline,
        async (ctx, middleware) => ({
          ...ctx,
          ...((await middleware(ctx, argv)) || {}),
        }),
        {} as Context
      );
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
    return res;
  };

  return {
    register,
    execute,
  };
};

export default registryFactory;
