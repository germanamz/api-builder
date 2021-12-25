interface ApiConfig {
  name: string;
  region: string;
  accountId: string;
  deploymentBucket: string;
  output: string;
  packageManager?: string;
  state: {
    bucket: string;
  };
  externals: string[];
  schemas: { [name: string]: any };
}

export default ApiConfig;
