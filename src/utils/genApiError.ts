import type { KnownErrorsMessages } from '@feprisa/errno';
import { Errno, ErrnoErrorCodes, genErrorFactory } from '@feprisa/errno';

import ApiErrorStatuses from '../interfaces/ApiErrorStatuses';
import { ApiGatewayProxyResponse } from '../interfaces/ApiGatewayProxyResponse';

export type GenApiError<KC extends keyof any = ErrnoErrorCodes> = (
  code: KC,
  headers?: Record<any, any>,
  isBase64Encoded?: boolean
) => Errno<KC>;

const genApiError = <KC extends keyof any = ErrnoErrorCodes>(
  errorMessages: KnownErrorsMessages<KC>,
  errorStatuses: ApiErrorStatuses<KC>
): GenApiError<KC> => {
  const genError = genErrorFactory<
    KC,
    Partial<Omit<ApiGatewayProxyResponse, 'body'>>
  >(errorMessages);

  return (code: KC, headers?: Record<any, any>, isBase64Encoded?: boolean) =>
    genError(code, {
      statusCode: errorStatuses[code],
      headers,
      isBase64Encoded,
    });
};

export default genApiError;
