import { Request } from 'express';

import { RestEvent } from '../types/RestEvent';

const objPairs = (obj?: Record<string, any>, forceToMulti?: boolean) => {
  let single = null;
  let multi = null;
  for (const [param, value] of Object.entries(obj || {})) {
    let val = value;
    if (Array.isArray(value)) {
      val = value[value.length - 1];
      multi = {
        ...(multi || {}),
        [param]: [...value],
      };
    } else if (forceToMulti) {
      val = value;
      multi = {
        ...(multi || {}),
        [param]: [value],
      };
    }
    single = {
      ...(single || {}),
      [param]: val,
    };
  }

  return {
    single,
    multi,
  };
};

const keyValuePairsToObj = (keyValueParis?: any[]) => {
  if (!keyValueParis) {
    return {};
  }

  const obj: Record<any, any> = {};

  for (let i = 0; i < keyValueParis.length; i += 2) {
    const [key, value] = keyValueParis.slice(i, i + 2);

    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
  }

  return obj;
};

const eventFromReq = async (req: Request): Promise<RestEvent> => {
  const isBase64Encoded =
    req.headers['content-type'] === 'application/octet-stream';
  const {
    single: queryStringParameters,
    multi: multiValueQueryStringParameters,
  } = objPairs(req.query);
  const { single: headers, multi: multiValueHeaders } = objPairs(
    keyValuePairsToObj(req.rawHeaders),
    true
  );

  return {
    body: req.body?.toString(isBase64Encoded ? 'base64' : 'utf8') || null,
    isBase64Encoded,
    resource: req.path,
    pathParameters: Object.keys(req.params).length ? req.params : null,
    queryStringParameters,
    multiValueQueryStringParameters,
    multiValueHeaders,
    httpMethod: req.method,
    headers,
    path: req.path,
    requestContext: {},
    stageVariables: {},
  } as RestEvent;
};

export default eventFromReq;
