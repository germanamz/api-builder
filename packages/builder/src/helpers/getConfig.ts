import { genError } from '@the-api-builder/errno';
import { pathExists, readJSON } from 'fs-extra';

import Context from '../types/Context';

const getConfig = async <R = any>(
  ctx: Context,
  jsPath: string,
  jsonPath: string,
  notFoundErrorCode?: string,
  defaultValue?: Partial<R>
): Promise<R | undefined> => {
  const jsPathExists = await pathExists(jsPath);
  const jsonPathExists = await pathExists(jsonPath);
  let config: any = defaultValue;

  if (jsPathExists) {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    config = require(jsPath);

    if (typeof config === 'function') {
      config = config(ctx);
    }
  } else if (jsonPathExists) {
    config = await readJSON(jsonPath);
  } else if (notFoundErrorCode) {
    throw genError(notFoundErrorCode);
  }

  return {
    ...(defaultValue || {}),
    ...config,
  } as R;
};

export default getConfig;