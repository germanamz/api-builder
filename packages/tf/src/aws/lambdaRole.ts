import { Statement } from '@the-api-builder/utils';
import { TerraformGenerator } from 'terraform-generator';

export type LambdaRoleOps = {
  generator: TerraformGenerator;
  name: string;
  fullName: string;
  statements?: Statement[];
};

const lambdaRole = ({
  generator,
  name,
  fullName,
  statements = [],
}: LambdaRoleOps) => {
  const role = generator.resource('aws_iam_role', name, {
    name: fullName,
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

  generator.resource('aws_iam_role_policy', name, {
    name: fullName,
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
        ...statements,
      ],
    }),
  });

  return role;
};

export default lambdaRole;
