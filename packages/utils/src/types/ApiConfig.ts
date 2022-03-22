export type ApiConfig = {
  name: string;
  region: string;
  accountId: string;
  deploymentBucket: string;
  output: string;
  packageManager?: string;
  state: {
    bucket: string;
  };
  runtime: 'docker' | 'native';
  aws?: {
    accountId: string;
    region: string;
    deployment: {
      region?: string;
      bucket: string;
    };
    prefix?: string;
    tags?: Record<string, string>;
    state?: {
      region?: string;
      bucket: string;
      key: string;
    };
  };
  externals: string[];
  schemas: { [name: string]: any };
  ws?: boolean;
};
