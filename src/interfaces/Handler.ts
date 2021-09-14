import { ApiGatewayProxyEvent } from './ApiGatewayProxyEvent';
import { ApiGatewayProxyResponse } from './ApiGatewayProxyResponse';

export type Handler = (
  event: ApiGatewayProxyEvent
) => Promise<ApiGatewayProxyResponse>;
