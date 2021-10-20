export interface ApiConfig {
  name: string;
  region: string;
  accountId: string;
  deploymentBucket: string;
  output: string;
  errorMessages: Record<string, string>;
  errorStatuses: Record<string, number>;
  packageManager?: string;
  state: {
    bucket: string;
  };
  externals: string[];
  schemas: { [name: string]: any };
}
