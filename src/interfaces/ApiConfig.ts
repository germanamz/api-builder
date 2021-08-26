export interface ApiConfig {
  name: string;
  region: string;
  accountId: string;
  stage?: string;
  state: {
    bucket: string;
  };
  schemas: { [name: string]: any };
}
