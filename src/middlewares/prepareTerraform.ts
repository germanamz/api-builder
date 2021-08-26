import { createHash } from 'crypto';
import { outputFile } from 'fs-extra';
import { join } from 'path';
import { list, map, Resource, TerraformGenerator } from 'terraform-generator';

import { Router } from '../interfaces/Router';
import { MiddlewareContext } from '../registry';

const generateRouterTf =
  (
    tfg: TerraformGenerator,
    ctx: MiddlewareContext,
    api: Resource,
    deploymentBucket: Record<string, any>,
    env: Record<string, any>,
    tag: Record<string, any>
  ) =>
  (router: Router) => {
    const { basename } = router;
    const {
      api: { name },
    } = ctx;
    const varLambdaName = `${name}-${basename}-$\{var.${env.name}}`;
    const role = tfg.resource('aws_iam_role', basename, {
      name: varLambdaName,
      assume_role_policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
            Effect: 'Allow',
          },
        ],
      }),
    });

    tfg.resource('aws_iam_role_policy', basename, {
      name: varLambdaName,
      role: role.id,
      policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Action: [
              'logs:CreateLogGroup',
              'logs:CreateLogStream',
              'logs:PutLogEvents',
            ],
            Resource: 'arn:aws:logs:*:*:*',
            Effect: 'Allow',
          },
          ...(router.statements || []),
        ],
      }),
    });

    tfg.resource('aws_cloudwatch_log_group', basename, {
      name: `/aws/lambda/${varLambdaName}`,
      retention_in_days: 14,
    });

    const artifactObject = tfg.data('aws_s3_bucket_object', basename, {
      bucket: deploymentBucket,
      key: `${name}/${varLambdaName}-$\{var.${tag.name}}.zip`,
    });

    const checksumObject = tfg.data(
      'aws_s3_bucket_object',
      `${basename}-checksum`,
      {
        bucket: deploymentBucket,
        key: `${name}/${varLambdaName}-$\{var.${tag.name}}.zip.checksum`,
      }
    );

    tfg.resource('aws_lambda_function', basename, {
      function_name: varLambdaName,
      handler: 'index.handler',
      role: role.attr('arn'),
      runtime: 'nodejs14.x',
      s3_bucket: deploymentBucket,
      s3_key: artifactObject.attr('key'),
      source_code_hash: checksumObject.attr('body'),
      publish: true,
    });

    tfg.resource('aws_lambda_permission', basename, {
      statement_id: 'AllowExecutionFromAPIGw',
      action: 'lambda:InvokeFunction',
      function_name: varLambdaName,
      principal: 'apigateway.amazonaws.com',
      source_arn: `${api.attr('execution_arn')}*/*/*`,
    });
  };

async function prepareTerraform(ctx: MiddlewareContext) {
  const { argv, api, schema, routers } = ctx;
  const { env = 'dev', tag = 'dev' } = argv;
  const { name, stage = 'live' } = api;
  const schemaJson = JSON.stringify(schema);
  const tfg = new TerraformGenerator();
  const deploymentBucketVar = tfg.variable('deploymentBucket');
  const envVar = tfg.variable('env', {}, env);
  const tagVar = tfg.variable('tag', {}, tag);

  const resApi = tfg.resource('aws_api_gateway_rest_api', '_', {
    name: `${name}-$\{var.${envVar.name}}`,
    body: schemaJson,
    endpoint_configuration: {
      types: list('REGIONAL'),
    },
  });

  const resApiDeployment = tfg.resource('aws_api_gateway_deployment', '_', {
    rest_api_id: resApi.id,
    triggers: map({
      redeployment: createHash('sha1').update(schemaJson).digest('base64'),
    }),
    lifecycle: {
      create_before_destroy: true,
    },
  });

  tfg.resource('aws_api_gateway_stage', '_', {
    deployment_id: resApiDeployment.id,
    rest_api_id: resApi.id,
    stage_name: stage,
  });

  routers.forEach(
    generateRouterTf(
      tfg,
      ctx,
      resApiDeployment,
      deploymentBucketVar,
      envVar,
      tagVar
    )
  );

  const terraform = tfg.generate();
  const terraformPath = join(process.cwd(), 'terraform', 'api.tf');
  await outputFile(terraformPath, terraform.tf);

  return { terraform };
}

export default prepareTerraform;
