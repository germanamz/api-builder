import type { ErrnoErrorCodes } from '@feprisa/errno';
import { Errno } from '@feprisa/errno';

import { ApiGatewayProxyResponse } from './ApiGatewayProxyResponse';

type ApiError<KC = ErrnoErrorCodes> = Errno<
  KC,
  Omit<ApiGatewayProxyResponse, 'body'>
>;

export default ApiError;
