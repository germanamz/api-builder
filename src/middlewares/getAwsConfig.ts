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
    region: ctx.api.region,
    accountId: ctx.api.accountId,
  };

  return { aws: config };
}

export default getAwsConfig;
