import { Stage } from '@the-api-builder/registry';
import { router, service } from '@the-api-builder/tf-rest';
import { resolve } from 'path';

import { Context } from '../Context';

const buildTerraform: Stage<Context> = async (ctx) => {
  const { api, argv, routes, openapi } = ctx;
  const { aws, name, runtime, output } = api;
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
    const routersShortNames = [];

    for await (const endpoint of endpoints) {
      const route = routes[endpoint];
      const { shortName } = router({
        generator,
        name: route.name,
        env,
        prefix,
        statements: route.config?.policyStatements || [],
        bucket: deployment.bucket,
        version,
        type: runtime,
        api: apiResource,
        vars: route.config?.variables || {},
      });
      routersShortNames.push(shortName);
    }

    if (runtime === 'docker') {
      console.log('Make sure these repositories are created before applying');
      console.log(routersShortNames.join('\n'));
    }

    generator.write({
      dir: resolve(process.cwd(), output, 'terraform'),
      format: true,
    });
  }
};

export default buildTerraform;
