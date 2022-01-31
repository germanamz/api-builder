import { map, TerraformGenerator } from 'terraform-generator';

export type AwsOps = {
  defaultTags?: Record<string, string>;
  s3?: { bucket: string; key: string; region: string };
};

const aws = ({ defaultTags, s3 }: AwsOps): TerraformGenerator => {
  const generator = new TerraformGenerator({
    required_providers: {
      aws: map({
        source: 'hashicorp/aws',
        version: '3.56.0',
      }),
    },
  });

  if (defaultTags) {
    generator.provider('aws', {
      default_tags: {
        tags: map(defaultTags),
      },
    });
  }

  if (s3) {
    generator.backend('s3', {
      bucket: s3.bucket,
      key: s3.key,
      region: s3.region,
    });
  }

  return generator;
};

export default aws;
