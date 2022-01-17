export type WsEvent = {
  headers?: Record<string, string>;
  multiValueHeaders?: Record<string, string[]>;
  requestContext: {
    routeKey: string;
    eventType: 'CONNECT' | 'DISCONNECT' | 'MESSAGE';
    extendedRequestId: string;
    requestTime: string;
    messageDirection: 'IN';
    stage: string;
    connectedAt: number;
    requestTimeEpoch: number;
    disconnectStatusCode?: 1000;
    disconnectReason?: string;
    identity: {
      sourceIp: string;
      accessKey?: string;
      accountId?: string;
      caller?: string;
      cognitoAuthenticationProvider?: string;
      cognitoAuthenticationType?: string;
      cognitoIdentityId?: string;
      cognitoIdentityPoolId?: string;
      principalOrgId?: string;
      user?: string;
      userAgent?: string;
      userArn?: string;
      clientCert?: {
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
    requestId: string;
    domainName: string;
    connectionId: string;
    apiId: string;
  };
  body?: any;
  isBase64Encoded: boolean;
};
