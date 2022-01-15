import { Errno } from '@the-api-builder/errno';

import { ApiGatewayProxyResponse } from '../types/ApiGatewayProxyResponse';
import { WsEvent } from '../types/WsEvent';
import { WsHandler } from '../types/WsHandler';
import parseJson from './parseJson';

const wsHandlerWrapper =
  (
    handler: WsHandler<any>
  ): WsHandler<Omit<ApiGatewayProxyResponse, 'headers'>> =>
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
          headers: {
            'Content-Type': 'application/json',
            ...(e.extra?.headers || {}),
          },
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
