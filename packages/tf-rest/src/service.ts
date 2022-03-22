import { aws, AwsOps } from '@the-api-builder/tf';
import { createHash } from 'crypto';
import { list, map } from 'terraform-generator';

export type ServiceOps = AwsOps & {
  name: string;
  openapi: any;
  env: string;
  docker?: boolean;
  stage?: string;
};

const service = ({
  openapi,
  name,
  env,
  stage = 'live',
  defaultTags,
  s3,
}: ServiceOps) => {
  const generator = aws({
    defaultTags,
    s3,
  });
  const schemaJson = JSON.stringify(openapi);
  const api = generator.resource('aws_api_gateway_rest_api', name, {
    name: `${name}-${env}`,
    body: schemaJson,
    endpoint_configuration: {
      types: list('REGIONAL'),
    },
  });

  const deployment = generator.resource('aws_api_gateway_deployment', name, {
    rest_api_id: api.id,
    triggers: map({
      redeployment: createHash('sha1').update(schemaJson).digest('base64'),
    }),
    lifecycle: {
      create_before_destroy: true,
    },
    depends_on: list(api),
  });

  const stageResource = generator.resource('aws_api_gateway_stage', stage, {
    deployment_id: deployment.id,
    rest_api_id: api.id,
    stage_name: stage,
    depends_on: list(deployment),
  });

  return {
    generator,
    api,
    deployment,
    stage: stageResource,
  };
};

export default service;
