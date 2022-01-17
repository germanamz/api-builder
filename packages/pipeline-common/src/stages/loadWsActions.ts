import { Stage } from '@the-api-builder/registry';
import { Extensions } from '@the-api-builder/utils';
import { existsSync } from 'fs';
import { opendir } from 'fs/promises';
import { basename, extname, join, resolve } from 'path';

import Context from '../Context';

const loadWsActions: Stage<Context> = async (ctx) => {
  const wsPath = resolve(process.cwd(), 'ws');

  if (!existsSync(wsPath)) {
    return {
      ws: ctx.api.ws,
    };
  }

  const wsActions: Context['wsActions'] = {};
  const actions = await opendir(wsPath);

  for await (const action of actions) {
    if (
      !action.isDirectory() &&
      Extensions.indexOf(extname(action.name)) > -1
    ) {
      const actionName = basename(action.name, extname(action.name));
      wsActions[actionName] = join(wsPath, action.name);
    }
  }

  return {
    wsActions,
    ws: ctx.api.ws,
  };
};

export default loadWsActions;
