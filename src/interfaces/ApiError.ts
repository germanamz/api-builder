import { Errno, KnownErrors } from '@feprisa/errno';

import { ApiGatewayProxyResponse } from './ApiGatewayProxyResponse';

type ApiError<KC = typeof KnownErrors[keyof typeof KnownErrors]> = Errno<
  KC,
  Omit<ApiGatewayProxyResponse, 'body'>
>;

export default ApiError;
