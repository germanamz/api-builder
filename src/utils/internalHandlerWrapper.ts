import { Errno, ErrnoErrors, genError } from '@feprisa/errno';

import { ApiGatewayProxyEvent } from '../types/ApiGatewayProxyEvent';
import { ApiGatewayProxyResponse } from '../types/ApiGatewayProxyResponse';
import { Handler } from '../types/Handler';
import HandlerContext from '../types/HandlerContext';

const internalHandlerWrapper =
  (handler: Handler<any>) =>
  async (
    event: ApiGatewayProxyEvent,
    handlerCtx: HandlerContext
  ): Promise<ApiGatewayProxyResponse> => {
    try {
      const res = await handler(event, handlerCtx);
      return {
        isBase64Encoded: false,
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 200,
        body: typeof res === 'string' ? res : JSON.stringify(res),
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
        body: JSON.stringify(genError(ErrnoErrors.UNKNOWN).toJSON()),
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
        },
        isBase64Encoded: false,
      };
    }
  };

export default internalHandlerWrapper;
