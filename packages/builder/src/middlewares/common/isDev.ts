import { Stage } from '@the-api-builder/registry';

import CommonPipelineContext from '../../types/CommonPipelineContext';

const isDev: Stage<CommonPipelineContext> = async () => ({
  isDev: process.env.NODE_ENV === 'development',
});

export default isDev;
