import { genError } from '@the-api-builder/errno';
import { pathExists } from 'fs-extra';

import Context from '../types/Context';

const getConfig = async <R = any>(
  ctx: Context,
  paths: string[],
  notFoundErrorCode?: string,
  defaultValue?: Partial<R>
): Promise<R | undefined> => {
  for await (const path of paths) {
    const exists = await pathExists(path);

    if (exists) {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      let config: any = require(path);

      if (config.default) {
        config = config.default;
      }

      if (typeof config === 'function') {
        config = config(ctx);
      }

      return {
        ...(defaultValue || {}),
        ...config,
      } as R;
    }
  }

  if (notFoundErrorCode) {
    throw genError(notFoundErrorCode);
  }

  return defaultValue as R;
};

export default getConfig;
