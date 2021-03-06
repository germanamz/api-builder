export type RestEvent = {
  resource: string;
  path: string;
  httpMethod: string;
  headers: { [key: string]: string } | null;
  multiValueHeaders: { [key: string]: string[] } | null;
  queryStringParameters: { [key: string]: string } | null;
  multiValueQueryStringParameters: { [key: string]: string[] } | null;
  requestContext: {
    accountId: string;
    apiId: string;
    authorizer: {
      claims: any;
      scopes: any;
    };
    domainName: string;
    domainPrefix: string;
    extendedRequestId: string;
    httpMethod: string;
    identity: {
      accessKey: string;
      accountId: string;
      caller: string;
      cognitoAuthenticationProvider: null;
      cognitoAuthenticationType: null;
      cognitoIdentityId: null;
      cognitoIdentityPoolId: null;
      principalOrgId: null;
      sourceIp: string;
      user: string;
      userAgent: string;
      userArn: string;
      clientCert: {
        clientCertPem: string;
        subjectDN: string;
        issuerDN: string;
        serialNumber: string;
        validity: {
          notBefore: string;
          notAfter: string;
        };
      };
    };
    path: string;
    protocol: string;
    requestId: string;
    requestTime: string;
    requestTimeEpoch: number;
    resourceId: string;
    resourcePath: string;
    stage: string;
  };
  pathParameters: { [key: string]: string } | null;
  stageVariables: { [key: string]: string } | null;
  body: string | null;
  isBase64Encoded: boolean;
};
