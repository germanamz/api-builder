import { HandlerResponse, RestHandler } from '@the-api-builder/utils';
import { Request, Response } from 'express';

import eventFromReq from './eventFromReq';

const opWrapper =
  (handler: RestHandler) => async (req: Request, res: Response) => {
    const event = await eventFromReq(req);
    const reqCtx: any = {};
    const { body, headers, statusCode } = (await handler(
      event,
      reqCtx
    )) as HandlerResponse;
    res.status(statusCode);
    res.set({
      ...headers,
    });
    res.send(body);
  };

export default opWrapper;
