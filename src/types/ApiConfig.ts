export interface ApiConfig {
  name: string;
  region: string;
  accountId: string;
  deploymentBucket: string;
  routesOutput: string;
  openapiOutput?: string;
  terraformOutput: string;
  state: {
    bucket: string;
  };
  externals: string[];
  schemas: { [name: string]: any };
}
