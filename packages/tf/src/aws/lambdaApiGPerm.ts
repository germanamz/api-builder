import { list, Resource, TerraformGenerator } from 'terraform-generator';

export type LambdaApiGPermOps = {
  generator: TerraformGenerator;
  name: string;
  lambda: Resource;
  api: Resource;
};

const lambdaApiGPerm = ({ generator, name, lambda, api }: LambdaApiGPermOps) =>
  generator.resource('aws_lambda_permission', name, {
    statement_id: 'AllowExecutionFromAPIGw',
    action: 'lambda:InvokeFunction',
    function_name: lambda.attr('function_name'),
    principal: 'apigateway.amazonaws.com',
    source_arn: `${api.attr('execution_arn')}/*/*/*`,
    depends_on: list(lambda, api),
  });

export default lambdaApiGPerm;
