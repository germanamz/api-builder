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
    deploymentBucket: Record<string, any>
  ) =>
  (router: Router) => {
    const { lambdaName, artifact } = router;
    const {
      packageJson: {
        api: { name },
      },
    } = ctx;
    const role = tfg.resource('aws_iam_role', lambdaName, {
      name: router.lambdaName,
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

    tfg.resource('aws_iam_role_policy', lambdaName, {
      name: router.lambdaName,
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

    tfg.resource('aws_cloudwatch_log_group', lambdaName, {
      name: `/aws/lambda/${lambdaName}`,
      retention_in_days: 14,
    });

    const artifactObject = tfg.data('aws_s3_bucket_object', lambdaName, {
      bucket: deploymentBucket,
      key: `${name}/${artifact}.zip`,
    });

    const checksumObject = tfg.data(
      'aws_s3_bucket_object',
      `${lambdaName}-checksum`,
      {
        bucket: deploymentBucket,
        key: `${name}/${artifact}.zip.checksum`,
      }
    );

    tfg.resource('aws_lambda_function', lambdaName, {
      function_name: lambdaName,
      handler: 'index.handler',
      role: role.attr('arn'),
      runtime: 'nodejs14.x',
      s3_bucket: deploymentBucket,
      s3_key: artifactObject.attr('key'),
      source_code_hash: checksumObject.attr('body'),
      publish: true,
    });

    tfg.resource('aws_lambda_permission', lambdaName, {
      statement_id: 'AllowExecutionFromAPIGw',
      action: 'lambda:InvokeFunction',
      function_name: lambdaName,
      principal: 'apigateway.amazonaws.com',
      source_arn: `${api.attr('execution_arn')}/*/*/*`,
    });
  };

async function prepareTerraform(ctx: MiddlewareContext) {
  const { argv, packageJson, schema, routers } = ctx;
  const { env = 'dev' } = argv;
  const { name, stage = 'live' } = packageJson.api || {};
  const schemaJson = JSON.stringify(schema);
  const tfg = new TerraformGenerator();
  const deploymentBucket = tfg.variable('deploymentBucket');

  const resApi = tfg.resource('aws_api_gateway_rest_api', '_', {
    name: `${name}-${env}`,
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
    generateRouterTf(tfg, ctx, resApiDeployment, deploymentBucket)
  );

  const terraform = tfg.generate();
  const terraformPath = join(process.cwd(), 'terraform', 'api.tf');
  await outputFile(terraformPath, terraform.tf);

  return { terraform };
}

export default prepareTerraform;
