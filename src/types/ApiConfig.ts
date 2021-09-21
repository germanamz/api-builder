export interface ApiConfig {
  name: string;
  region: string;
  accountId: string;
  routesOutput: string;
  openapiOutput?: string;
  state: {
    bucket: string;
  };
  externals: string[];
  schemas: { [name: string]: any };
}
