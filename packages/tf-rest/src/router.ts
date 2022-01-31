import { awsUtils } from '@the-api-builder/tf';
import { Statement } from '@the-api-builder/utils';
import { Resource, TerraformGenerator } from 'terraform-generator';

export type RouterOps = {
  generator: TerraformGenerator;
  prefix: string;
  name: string;
  env: string;
  api: Resource;
  statements: Statement[];
  vars: Record<string, string>;
  type: awsUtils.LambdaOps['type'];
  bucket: string;
  version: string;
};

const router = ({
  generator,
  name,
  env,
  prefix,
  statements,
  api,
  vars,
  type,
  bucket,
  version,
}: RouterOps) => {
  const shortName = `${prefix}-${name}`;
  const fullName = `${shortName}-${env}`;

  const role = awsUtils.lambdaRole({
    generator,
    fullName,
    name,
    statements,
  });
  const lambda = awsUtils.lambda({
    generator,
    name,
    fullName,
    shortName,
    role,
    type,
    api,
    vars,
    bucket,
    version,
  });
  const permission = awsUtils.lambdaApiGPerm({
    generator,
    name,
    lambda,
    api,
  });

  return {
    role,
    lambda,
    permission,
  };
};

export default router;
