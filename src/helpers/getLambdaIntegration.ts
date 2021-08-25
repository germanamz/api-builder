import getLambdaArn from './getLambdaInvokeArn';

function getLambdaIntegration(lambda: string) {
  return {
    type: 'aws_proxy',
    responses: {
      default: {
        statusCode: '200',
      },
    },
    uri: getLambdaArn(lambda),
    passthroughBehavior: 'when_no_match',
    httpMethod: 'POST',
    contentHandling: 'CONVERT_TO_TEXT',
  };
}

export default getLambdaIntegration;
