import {
  Errno,
  ErrnoErrors,
  ErrnoErrorsMessages,
} from '@the-api-builder/errno';

import AsResponseObject from '../constants/AsResponseObject';
import { HandlerResponse } from '../types/HandlerResponse';
import { RestHandler } from '../types/RestHandler';
import { RestHandlerEvent } from '../types/RestHandlerEvent';
import prepareEventForHandler from './prepareEventForHandler';

const internalHandlerWrapper =
  (handler: RestHandler<any>) =>
  async (
    event: RestHandlerEvent,
    handlerCtx: any
  ): Promise<HandlerResponse> => {
    try {
      const res = await handler(prepareEventForHandler(event), handlerCtx);

      if (typeof res === 'object' && res[AsResponseObject]) {
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

      const errnoInstance: any = new Errno(
        ErrnoErrorsMessages[ErrnoErrors.UNKNOWN],
        ErrnoErrors.UNKNOWN
      );

      console.log('errnoInstance', errnoInstance);
      // eslint-disable-next-line no-proto
      console.log('errnoInstance', errnoInstance.__proto__);

      return {
        body: JSON.stringify(errnoInstance.toJSON()),
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
        },
        isBase64Encoded: false,
      };
    }
  };

export default internalHandlerWrapper;
