import { Stage } from '@the-api-builder/registry';

import Context from '../Context';

const isDev: Stage<Context> = async (ctx) => ({
  isDev: ctx.action === 'dev',
});

export default isDev;
