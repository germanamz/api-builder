import {
  Errno,
  ErrnoErrorCodes,
  ErrnoErrors,
  genError,
  KnownErrorsMessages,
} from '@feprisa/errno';

import ApiError from '../types/ApiError';
import ApiErrorStatuses from '../types/ApiErrorStatuses';
import { ApiGatewayProxyEvent } from '../types/ApiGatewayProxyEvent';
import { ApiGatewayProxyResponse } from '../types/ApiGatewayProxyResponse';
import { Handler } from '../types/Handler';
import HandlerContext from '../types/HandlerContext';
import genApiErrorFactory, { GenApiError } from './genApiError';

const handlerWrapper = <KC extends keyof any = ErrnoErrorCodes>(
  errorMessages: KnownErrorsMessages<KC>,
  errorStatuses: ApiErrorStatuses<KC>,
  handler: Handler<GenApiError<KC>, any>
) => {
  const genApiError = genApiErrorFactory<KC>(errorMessages, errorStatuses);

  return async (
    event: ApiGatewayProxyEvent,
    ctx: HandlerContext<typeof genApiError>
  ): Promise<ApiGatewayProxyResponse> => {
    try {
      const res = await handler(event, {
        ...ctx,
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

      console.error(e.toString());

      return {
        body: JSON.stringify(genError(ErrnoErrors.UNKNOWN)),
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
        },
        isBase64Encoded: false,
      };
    }
  };
};

export default handlerWrapper;
