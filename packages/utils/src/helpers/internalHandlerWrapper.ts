import { Errno, ErrnoErrors, genError } from '@the-api-builder/errno';

import AsResponseObject from '../constants/AsResponseObject';
import { HandlerResponse } from '../types/HandlerResponse';
import { RestHandler } from '../types/RestHandler';
import { RestHandlerEvent } from '../types/RestHandlerEvent';

const internalHandlerWrapper =
  (handler: RestHandler<any>) =>
  async (
    event: RestHandlerEvent,
    handlerCtx: any
  ): Promise<HandlerResponse> => {
    try {
      const res = { ...(await handler(event, handlerCtx)) };

      if (res[AsResponseObject]) {
        delete res[AsResponseObject];
        return res;
      }

      return {
        isBase64Encoded: false,
        headers: { 'Content-Type': 'application/json' },
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
