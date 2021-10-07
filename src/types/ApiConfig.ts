export interface ApiConfig {
  name: string;
  region: string;
  accountId: string;
  deploymentBucket: string;
  output: string;
  state: {
    bucket: string;
  };
  externals: string[];
  schemas: { [name: string]: any };
}
