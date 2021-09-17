import {
  Errno,
  ErrnoErrorCodes,
  ErrnoErrors,
  genError,
  KnownErrorsMessages,
} from '@feprisa/errno';

import ApiError from '../interfaces/ApiError';
import ApiErrorStatuses from '../interfaces/ApiErrorStatuses';
import { ApiGatewayProxyEvent } from '../interfaces/ApiGatewayProxyEvent';
import { ApiGatewayProxyResponse } from '../interfaces/ApiGatewayProxyResponse';
import { Handler } from '../interfaces/Handler';
import HandlerContext from '../interfaces/HandlerContext';
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
        headers: {},
        statusCode: 200,
        body: typeof res === 'string' ? res : JSON.stringify(res),
      };
    } catch (e) {
      if (e instanceof Errno) {
        const error: ApiError = e;
        return {
          statusCode: 500,
          headers: {},
          isBase64Encoded: false,
          ...error.extra,
          body: JSON.stringify(e.toJSON()),
        };
      }

      console.error(e);

      return {
        body: JSON.stringify(genError(ErrnoErrors.UNKNOWN)),
        statusCode: 500,
        headers: {},
        isBase64Encoded: false,
      };
    }
  };
};

export default handlerWrapper;
