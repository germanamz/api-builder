import { extendMessages, genError } from '@the-api-builder/errno';

import Context from './Context';
import Pipeline from './Pipeline';

export const RegistryErrors = {
  NO_PIPELINE: 'Pipeline not found',
};

extendMessages(RegistryErrors);

class Registry<C extends Context> {
  private $map = new Map<string, Pipeline<any>>();

  async execute(name: string, argv?: Context['argv']): Promise<Partial<C>> {
    const pipeline = this.$map.get(name);

    if (!pipeline) {
      throw genError(RegistryErrors.NO_PIPELINE);
    }

    let ctx = {
      argv,
    } as C;

    for await (const [, fn] of pipeline.entries) {
      const res = await fn(ctx);
      ctx = {
        ...ctx,
        ...res,
      };
    }

    return ctx;
  }

  remove(name: string) {
    this.$map.delete(name);

    return this;
  }

  register(name: string, pipeline: Pipeline<any>) {
    this.$map.set(name, pipeline);

    return this;
  }
}

export default Registry;
