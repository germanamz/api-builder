import { Request } from 'express';

import { RestEvent } from '../types/RestEvent';

const eventFromReq = async (req: Request): Promise<RestEvent> => {
  const isBase64Encoded =
    req.headers['content-type'] === 'application/octet-stream';
  return {
    body: isBase64Encoded
      ? (req.body as Buffer).toString('base64')
      : req.body.toString(),
    isBase64Encoded,
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
  } as RestEvent;
};

export default eventFromReq;
