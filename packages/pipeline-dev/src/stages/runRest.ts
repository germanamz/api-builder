import { Stage } from '@the-api-builder/registry';
import { start } from '@the-api-builder/server-rest';
import { buildRouter, RestHandler } from '@the-api-builder/utils';
import { URL } from 'url';

import Context from '../Context';

const runRest: Stage<Context> = async (ctx) => {
  const operations: Array<[name: string, handler: RestHandler]> = [];

  for await (const [endpoint, route] of Object.entries(ctx.routes)) {
    const router: RestHandler = await buildRouter(ctx, endpoint, route);
    operations.push([route.name, router]);
  }

  const port = process.env.REST_PORT || '3000';

  await start(ctx.openapi, operations, ctx.api.schemas, port);

  const url = new URL('http://localhost');
  url.port = port;
  console.log(`REST Listening on ${url.toString()}`);

  return undefined;
};

export default runRest;
