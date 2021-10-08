import { Errno, ErrnoErrors, genError } from '@feprisa/errno';

import ApiError from '../types/ApiError';
import { ApiGatewayProxyEvent } from '../types/ApiGatewayProxyEvent';
import { ApiGatewayProxyResponse } from '../types/ApiGatewayProxyResponse';
import { Handler } from '../types/Handler';
import HandlerContext from '../types/HandlerContext';
import genApiErrorFactory from './genApiError';

const internalHandlerWrapper = (
  errorMessages: Record<string, string>,
  errorStatuses: Record<string, number>,
  handler: Handler<any>
) => {
  const genApiError = genApiErrorFactory(errorMessages, errorStatuses);

  return async (
    event: ApiGatewayProxyEvent,
    handlerCtx: HandlerContext
  ): Promise<ApiGatewayProxyResponse> => {
    try {
      const res = await handler(event, {
        ...handlerCtx,
        genApiError,
      });
      return {
        isBase64Encoded: false,
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 200,
        body: typeof res === 'string' ? res : JSON.stringify(res),
      };
    } catch (e: any) {
      if (e instanceof Errno) {
        const error: ApiError = e;
        return {
          statusCode: 500,
          isBase64Encoded: false,
          ...error.extra,
          headers: {
            'Content-Type': 'application/json',
            ...(error.extra?.headers || {}),
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
};

export default internalHandlerWrapper;
