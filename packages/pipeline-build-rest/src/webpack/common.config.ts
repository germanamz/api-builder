import { resolve } from 'path';
import Types, { EntryObject } from 'webpack';

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
  externals?: Types.Configuration['externals'];
  isDev?: boolean;
}

function common({
  entry,
  output,
  filename,
  context,
  externals,
  isDev = false,
}: CommonOpts): Types.Configuration {
  return {
    node: false,
    target: ['node16', 'es2018'],
    devtool: 'inline-source-map',
    externalsPresets: {
      node: true,
    },
    optimization: {
      minimize: false,
      nodeEnv: false,
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    externals,
    mode: isDev ? 'development' : 'production',
    context,
    entry,
    output: {
      filename,
      path: output,
      library: {
        type: 'umd',
      },
    },
    module: {
      rules: [
        {
          test: /\.[jt]s$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: resolve(process.cwd(), 'tsconfig.json'),
              },
            },
          ],
        },
      ],
    },
  };
}

export default common;
