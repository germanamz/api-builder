import { Stage } from '@the-api-builder/registry';
import { router, service } from '@the-api-builder/tf-rest';

import { Context } from '../Context';

const buildTerraform: Stage<Context> = async (ctx) => {
  const { api, argv, routes, openapi } = ctx;
  const { aws, name, runtime } = api;
  if (aws) {
    const { state, tags, region, prefix = '', deployment } = aws;
    const { env, stage, version } = argv;
    const endpoints = Object.keys(routes);
    const s3 = state ? { region, ...(state || {}) } : undefined;
    const { api: apiResource, generator } = service({
      openapi,
      name,
      s3,
      defaultTags: {
        ...tags,
        RestApi: name,
      },
      env,
      stage,
    });

    for await (const endpoint of endpoints) {
      const route = routes[endpoint];
      router({
        generator,
        name,
        env,
        prefix,
        statements: route.config?.policyStatements || [],
        bucket: deployment.bucket,
        version,
        type: runtime,
        api: apiResource,
        vars: route.config?.variables || {},
      });
    }
  }
};

export default buildTerraform;
