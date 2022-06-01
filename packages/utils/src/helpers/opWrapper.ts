import { Request, Response } from 'express';

import { HandlerResponse } from '../types/HandlerResponse';
import { RestHandler } from '../types/RestHandler';
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
      'Content-Type': 'application/json',
      ...headers,
    });
    res.send(body);
  };

export default opWrapper;
