import Types, { EntryObject } from 'webpack';
import nodeExternals from 'webpack-node-externals';

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

function common({
  entry,
  output,
  filename,
  context,
  externals,
}: CommonOpts): Types.Configuration {
  return {
    node: false,
    target: 'node',
    externalsPresets: {
      node: true,
    },
    optimization: {
      nodeEnv: false,
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    externals: externals?.map(
      (modulesDir) =>
        nodeExternals({
          modulesDir,
        }) as any
    ),
    mode: 'production',
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
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-typescript'],
            },
          },
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
  };
}

export default common;
