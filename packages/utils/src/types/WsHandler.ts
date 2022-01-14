import { ApiGatewayProxyResponse } from './ApiGatewayProxyResponse';
import { WsEvent } from './WsEvent';

export type WsHandler<R = ApiGatewayProxyResponse> = (
  event: WsEvent,
  ctx?: any
) => Promise<R>;
