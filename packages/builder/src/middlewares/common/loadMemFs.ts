import { Stage } from '@the-api-builder/registry';
import * as fs from 'fs';
import { createFsFromVolume, Volume } from 'memfs';
import ufs from 'unionfs';

import CommonPipelineContext from '../../types/CommonPipelineContext';

const loadMemFs: Stage<CommonPipelineContext> = async () => {
  const inFs = createFsFromVolume(new Volume());
  const outFs = createFsFromVolume(new Volume());

  return {
    ufs: ufs
      .use(fs)
      .use(inFs as any)
      .use(outFs as any),
    inFs,
    outFs,
  };
};

export default loadMemFs;
