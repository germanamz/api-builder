import { list, map, Resource, TerraformGenerator } from 'terraform-generator';

export type LambdaOps = {
  generator: TerraformGenerator;
  name: string;
  fullName: string;
  shortName: string;
  role: Resource;
  api: Resource;
  vars?: Record<string, string>;
  version: string;
  type: 'docker' | 'native';
  bucket: string;
};

const lambda = ({
  generator,
  name,
  fullName,
  shortName,
  type,
  role,
  api,
  vars,
  bucket,
  version,
}: LambdaOps) => {
  generator.resource('aws_cloudwatch_log_group', name, {
    name: `/aws/lambda/${fullName}`,
    retention_in_days: 14,
  });

  let lambdaConfig;
  if (type === 'docker') {
    const ercRepo = generator.resource('aws_ecr_repository', name, {
      name: shortName,
    });
    const artifactImage = generator.data('aws_ecr_image', name, {
      repository_name: ercRepo.attr('name'),
      image_tag: version,
    });
    lambdaConfig = {
      image_uri: `${ercRepo.attr('repository_url')}@${artifactImage.id}`,
      package_type: 'Image',
    };
  } else if (type === 'native') {
    const artifactName = `${fullName}-${version}`;
    const artifactObject = generator.data('aws_s3_bucket_object', name, {
      bucket,
      key: `${artifactName}.zip`,
    });

    const checksumObject = generator.data(
      'aws_s3_bucket_object',
      `${name}-checksum`,
      {
        bucket,
        key: `${artifactName}.zip.checksum`,
      }
    );
    lambdaConfig = {
      s3_bucket: bucket,
      s3_key: artifactObject.attr('key'),
      source_code_hash: checksumObject.attr('body'),
      package_type: 'Zip',
      runtime: 'nodejs14.x',
      handler: 'index.handler',
    };
  } else {
    throw new Error(`No lambda type set [${name}][${shortName}][${fullName}]`);
  }

  const lambdaOptions: any = {
    ...lambdaConfig,
    function_name: fullName,
    role: role.attr('arn'),
    timeout: 29,
    publish: true,
    depends_on: list(api),
  };

  if (vars) {
    lambdaOptions.environment = {
      variables: map(vars || {}),
    };
  }

  return generator.resource('aws_lambda_function', name, lambdaOptions);
};

export default lambda;
