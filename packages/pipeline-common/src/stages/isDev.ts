import { Stage } from '@the-api-builder/registry';

import Context from '../Context';

const isDev: Stage<Context> = async () => ({
  isDev: process.env.NODE_ENV === 'development',
});

export default isDev;
