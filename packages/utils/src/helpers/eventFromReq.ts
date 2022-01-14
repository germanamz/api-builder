import { Request } from 'express';

import { ApiGatewayProxyEvent } from '../types/ApiGatewayProxyEvent';

const eventFromReq = async (req: Request): Promise<ApiGatewayProxyEvent> =>
  ({
    body: req.body,
    isBase64Encoded: false,
    resource: '',
    pathParameters: req.params,
    queryStringParameters: req.query,
    multiValueQueryStringParameters: {},
    multiValueHeaders: {},
    httpMethod: req.method,
    headers: req.headers,
    path: req.path,
    requestContext: {},
    stageVariables: {},
  } as ApiGatewayProxyEvent);

export default eventFromReq;
