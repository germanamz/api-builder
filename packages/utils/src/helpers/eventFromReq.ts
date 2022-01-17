import { Request } from 'express';

import { RestEvent } from '../types/RestEvent';

const eventFromReq = async (req: Request): Promise<RestEvent> =>
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
  } as RestEvent);

export default eventFromReq;
