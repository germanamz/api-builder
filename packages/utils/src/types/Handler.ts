import { ApiGatewayProxyResponse } from './ApiGatewayProxyResponse';
import { HandlerEvent } from './HandlerEvent';

export type Handler<R = ApiGatewayProxyResponse> = (
  event: HandlerEvent,
  context: any
) => Promise<R>;
