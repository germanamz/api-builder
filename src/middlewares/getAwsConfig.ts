import { MiddlewareContext } from '../registry';

export interface AwsConfig {
  region?: string;
  accountId?: string;
}

let config: AwsConfig;

async function getAwsConfig(ctx: MiddlewareContext) {
  if (config) {
    return { aws: config };
  }
  config = {
    region: ctx.packageJson.api.region,
    accountId: ctx.packageJson.api.accountId,
  };

  return { aws: config };
}

export default getAwsConfig;
