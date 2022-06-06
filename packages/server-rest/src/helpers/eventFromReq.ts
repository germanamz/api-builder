import '../Request';

import { RestEvent } from '@the-api-builder/utils';
import { Request } from 'express';

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
  let isBase64Encoded = false;
  const {
    single: queryStringParameters,
    multi: multiValueQueryStringParameters,
  } = objPairs(req.query);
  const { single: headers, multi: multiValueHeaders } = objPairs(
    keyValuePairsToObj(req.rawHeaders),
    true
  );
  let body = req.body || null;

  switch (req.header('content-type')) {
    case 'application/octet-stream':
      body = req.rawBody?.toString('base64');
      isBase64Encoded = true;
      break;

    default:
    case 'application/json':
      body = req.rawBody?.toString();
      break;
  }

  return {
    body,
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
