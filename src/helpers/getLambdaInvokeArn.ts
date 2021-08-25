import { resolveCurrentCtx } from '../dispatch';

function getLambdaArn(lambda: string) {
  const ctx = resolveCurrentCtx();
  const { aws } = ctx;
  return `arn:aws:apigateway:${aws.region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${aws.region}:${aws.accountId}:function:${lambda}/invocations`;
}

export default getLambdaArn;
