import { ApiGatewayProxyEvent } from './ApiGatewayProxyEvent';
import { ApiGatewayProxyResponse } from './ApiGatewayProxyResponse';

export type Handler<R = ApiGatewayProxyResponse> = (
  event: ApiGatewayProxyEvent
) => Promise<R>;
