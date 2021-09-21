import Types, { EntryObject } from 'webpack';

// import RoutersPlugin from '../plugins/RoutersPlugin';
import common from './common.config';

export interface CommonOpts {
  entry:
    | string
    | (() =>
        | string
        | EntryObject
        | string[]
        | Promise<string | EntryObject | string[]>)
    | EntryObject
    | string[];
  output: string;
  context?: string;
  filename?: string;
  externals: string[];
}

function router({
  entry,
  output,
  filename,
  context,
  externals,
}: CommonOpts): Types.Configuration {
  return {
    ...common({ entry, output, filename, context, externals }),
  };
}

export default router;
