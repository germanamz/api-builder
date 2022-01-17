import { Stage } from '@the-api-builder/registry';
import { start } from '@the-api-builder/server-ws';
import { WsHandler } from '@the-api-builder/utils';
import { URL } from 'url';

import Context from '../Context';

const runWs: Stage<Context> = async (ctx) => {
  if (!ctx.ws && !ctx.wsActions) {
    return undefined;
  }

  const actionEntries = Object.entries(ctx.wsActions || {});
  const actions: Array<[string, WsHandler<any>]> = [];

  for await (const [action, actionPath] of actionEntries) {
    const handler = await import(actionPath);
    actions.push([action, handler]);
  }

  const port = process.env.WS_PORT || '3001';
  await start(actions, port);

  const url = new URL('http://localhost');
  url.port = port;
  console.log(`WS Listening on ${url.toString()}`);

  return undefined;
};

export default runWs;
