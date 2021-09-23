import { createHash } from 'crypto';
import { ensureDir } from 'fs-extra';
import { resolve } from 'path';
import {
  fn,
  list,
  map,
  Resource,
  TerraformGenerator,
} from 'terraform-generator';

import CommonArgv from '../types/CommonArgv';
import Context from '../types/Context';
import Middleware from '../types/Middleware';

const generateRouterTf =
  (
    ctx: Context,
    argv: BuildTerraformArgv,
    tfg: TerraformGenerator,
    resApi: Resource
  ) =>
  (path: string) => {
    const { api, routes } = ctx;
    const { name: basename, config } = routes[path];
    const simpleLambdaName = `${api.name}-${basename}`;
    const lambdaName = `${simpleLambdaName}-${process.env.NODE_ENV}`;
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

    let lambdaConfig;
    if (argv.docker) {
      const ercRepo = tfg.resource('aws_ecr_repository', basename, {
        name: simpleLambdaName,
      });
      const artifactImage = tfg.data('aws_ecr_image', basename, {
        repository_name: ercRepo.attr('name'),
        image_tag: argv.version,
      });
      lambdaConfig = {
        image_uri: `${ercRepo.attr('repository_url')}:${fn(
          'replace',
          artifactImage.id,
          'sha256:',
          ''
        )}`,
        package_type: 'Image',
      };
    } else {
      const artifactObject = tfg.data('aws_s3_bucket_object', basename, {
        bucket: api.deploymentBucket,
        key: `${api.name}/${simpleLambdaName}-${argv.version}.zip`,
      });

      const checksumObject = tfg.data(
        'aws_s3_bucket_object',
        `${basename}-checksum`,
        {
          bucket: api.deploymentBucket,
          key: `${api.name}/${simpleLambdaName}-${argv.version}.zip.checksum`,
        }
      );
      lambdaConfig = {
        s3_bucket: api.deploymentBucket,
        s3_key: artifactObject.attr('key'),
        source_code_hash: checksumObject.attr('body'),
        package_type: 'Zip',
        runtime: 'nodejs14.x',
        handler: 'index.handler',
      };
    }

    const lambda = tfg.resource('aws_lambda_function', basename, {
      ...lambdaConfig,
      function_name: lambdaName,
      role: role.attr('arn'),
      publish: true,
      depends_on: list(resApi),
    });

    tfg.resource('aws_lambda_permission', basename, {
      statement_id: 'AllowExecutionFromAPIGw',
      action: 'lambda:InvokeFunction',
      function_name: lambdaName,
      principal: 'apigateway.amazonaws.com',
      source_arn: `${resApi.attr('execution_arn')}*/*/*`,
      depends_on: list(lambda, resApi),
    });
  };

export type BuildTerraformArgv = CommonArgv & {
  docker?: boolean;
};

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
    depends_on: list(resApi),
  });

  tfg.resource('aws_api_gateway_stage', '_', {
    deployment_id: resApiDeployment.id,
    rest_api_id: resApi.id,
    stage_name: 'live',
    depends_on: list(resApiDeployment),
  });

  Object.keys(routes).forEach(generateRouterTf(ctx, argv, tfg, resApi));

  const outdir = resolve(process.cwd(), terraformOutput);

  await ensureDir(outdir);

  tfg.write({
    dir: outdir,
    format: true,
  });
};

export default buildTerraform;
