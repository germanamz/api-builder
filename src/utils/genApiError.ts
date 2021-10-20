import type { KnownErrorsMessages } from '@feprisa/errno';
import { Errno, genErrorFactory } from '@feprisa/errno';

import ApiErrorStatuses from '../types/ApiErrorStatuses';
import { ApiGatewayProxyResponse } from '../types/ApiGatewayProxyResponse';

export type GenApiError = (
  code: string,
  headers?: Record<any, any>,
  isBase64Encoded?: boolean
) => Errno<any>;

const genApiError = (
  errorMessages: KnownErrorsMessages<any>,
  errorStatuses: ApiErrorStatuses<any>
): GenApiError => {
  const genError = genErrorFactory<
    any,
    Partial<Omit<ApiGatewayProxyResponse, 'body'>>
  >(errorMessages);

  return (
    code: any,
    headers?: Record<string, string | string[]>,
    isBase64Encoded?: boolean
  ) =>
    genError(code, {
      statusCode: errorStatuses[code],
      headers,
      isBase64Encoded,
    });
};

export default genApiError;
