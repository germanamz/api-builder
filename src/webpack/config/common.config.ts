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
}

function common({
  entry,
  output,
  filename,
  context,
}: CommonOpts): Types.Configuration {
  return {
    node: false,
    target: 'node',
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
    optimization: {
      minimize: true,
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
