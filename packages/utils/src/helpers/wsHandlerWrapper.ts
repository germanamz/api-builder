import { Errno } from '@the-api-builder/errno';

import { HandlerResponse } from '../types/HandlerResponse';
import { WsEvent } from '../types/WsEvent';
import { WsHandler } from '../types/WsHandler';
import parseJson from './parseJson';

const wsHandlerWrapper =
  (handler: WsHandler<any>): WsHandler<Omit<HandlerResponse, 'headers'>> =>
  async (event: WsEvent, ctx: any) => {
    const ev: WsEvent = {
      ...event,
      body: parseJson(event.body),
    };

    try {
      const res = await handler(ev, ctx);

      return {
        body: typeof res !== 'string' ? JSON.stringify(res) : res,
        isBase64Encoded: false,
        statusCode: 200,
      };
    } catch (e: any) {
      if (e instanceof Errno || e.isErrno) {
        return {
          statusCode: 500,
          isBase64Encoded: false,
          ...e.extra,
          body: JSON.stringify(e.toJSON()),
        };
      }

      console.error(e);

      return {
        statusCode: 500,
        body: 'Internal error',
        isBase64Encoded: false,
      };
    }
  };

export default wsHandlerWrapper;
