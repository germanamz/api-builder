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
    target: 'node',
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
