function getCors() {
  return {
    responses: {
      200: {
        content: {},
        headers: {
          'Access-Control-Allow-Origin': {
            schema: {
              type: 'string',
            },
          },
          'Access-Control-Allow-Methods': {
            schema: {
              type: 'string',
            },
          },
          'Access-Control-Allow-Headers': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
    'x-amazon-apigateway-integration': {
      type: 'mock',
      requestTemplates: {
        'application/json': '{ "statusCode": 200 }',
      },
      responses: {
        default: {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers':
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Origin': "'*'",
          },
          responseTemplates: {
            'application/json': '{}',
          },
        },
      },
    },
  };
}

export default getCors;
