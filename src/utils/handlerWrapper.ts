import { Errno, ErrnoErrors, genError } from '@feprisa/errno';

import ApiError from '../interfaces/ApiError';
import { ApiGatewayProxyEvent } from '../interfaces/ApiGatewayProxyEvent';
import { ApiGatewayProxyResponse } from '../interfaces/ApiGatewayProxyResponse';
import { Handler } from '../interfaces/Handler';

const handlerWrapper =
  (handler: Handler<any>) =>
  async (event: ApiGatewayProxyEvent): Promise<ApiGatewayProxyResponse> => {
    try {
      const res = await handler(event);
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

export default handlerWrapper;
