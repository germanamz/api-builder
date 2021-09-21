import { createHash } from 'crypto';
import { ensureDir } from 'fs-extra';
import { resolve } from 'path';
import { list, map, Resource, TerraformGenerator } from 'terraform-generator';

import CommonArgv from '../types/CommonArgv';
import Context from '../types/Context';
import Middleware from '../types/Middleware';

const generateRouterTf =
  (
    ctx: Context,
    argv: BuildTerraformArgv,
    tfg: TerraformGenerator,
    resApi: Resource,
    layers: Resource
  ) =>
  (path: string) => {
    const { api, routes } = ctx;
    const { name: basename, config } = routes[path];
    const lambdaName = `${api.name}-${basename}`;
    const role = tfg.resource('aws_iam_role', basename, {
      name: lambdaName,
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
      name: lambdaName,
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
          ...(config?.policyStatements || []),
        ],
      }),
    });

    tfg.resource('aws_cloudwatch_log_group', basename, {
      name: `/aws/lambda/${lambdaName}`,
      retention_in_days: 14,
    });

    const artifactObject = tfg.data('aws_s3_bucket_object', basename, {
      bucket: api.deploymentBucket,
      key: `${api.name}/${lambdaName}-${argv.version}.zip`,
    });

    const checksumObject = tfg.data(
      'aws_s3_bucket_object',
      `${basename}-checksum`,
      {
        bucket: api.deploymentBucket,
        key: `${api.name}/${lambdaName}-${argv.version}.zip.checksum`,
      }
    );

    tfg.resource('aws_lambda_function', basename, {
      function_name: lambdaName,
      handler: 'index.handler',
      role: role.attr('arn'),
      runtime: 'nodejs14.x',
      s3_bucket: api.deploymentBucket,
      s3_key: artifactObject.attr('key'),
      source_code_hash: checksumObject.attr('body'),
      layers: list(layers.attr('arn')),
      publish: true,
    });

    tfg.resource('aws_lambda_permission', basename, {
      statement_id: 'AllowExecutionFromAPIGw',
      action: 'lambda:InvokeFunction',
      function_name: lambdaName,
      principal: 'apigateway.amazonaws.com',
      source_arn: `${resApi.attr('execution_arn')}*/*/*`,
    });
  };

export type BuildTerraformArgv = CommonArgv & {};

const buildTerraform: Middleware<keyof Context, null> = async (ctx, argv) => {
  const { api, openapi, routes } = ctx;
  const { name, terraformOutput } = api;
  const schemaJson = JSON.stringify(openapi);
  const tfg = new TerraformGenerator({
    required_providers: {
      aws: map({
        source: 'hashicorp/aws',
        version: '3.56.0',
      }),
    },
  });

  tfg.provider('aws', {
    default_tags: {
      tags: map({
        App: api.name,
      }),
    },
  });

  tfg.backend('s3', {
    bucket: api.state.bucket,
    key: api.name,
    region: api.region,
  });

  const resApi = tfg.resource('aws_api_gateway_rest_api', '_', {
    name: `${name}-${process.env.NODE_ENV}`,
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
    stage_name: 'live',
  });

  const layers = tfg.resource('aws_lambda_layer_version', 'deps', {
    layer_name: `${api.name}-deps-${argv.version}`,
    s3_bucket: api.deploymentBucket,
    s3_key: `${api.name}/${api.name}-deps-${argv.version}.zip`,
    compatible_runtimes: list('nodejs12.x'),
  });

  Object.keys(routes).forEach(generateRouterTf(ctx, argv, tfg, resApi, layers));

  const outdir = resolve(process.cwd(), terraformOutput);

  await ensureDir(outdir);

  tfg.write({
    dir: outdir,
    format: true,
  });
};

export default buildTerraform;
