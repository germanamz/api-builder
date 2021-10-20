import { ApiGatewayProxyEvent } from './ApiGatewayProxyEvent';
import { ApiGatewayProxyResponse } from './ApiGatewayProxyResponse';
import HandlerContext from './HandlerContext';

export type Handler<R = ApiGatewayProxyResponse> = (
  event: ApiGatewayProxyEvent,
  context: HandlerContext
) => Promise<R>;
