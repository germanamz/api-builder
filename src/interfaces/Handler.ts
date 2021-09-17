import { ApiGatewayProxyEvent } from './ApiGatewayProxyEvent';
import { ApiGatewayProxyResponse } from './ApiGatewayProxyResponse';
import HandlerContext from './HandlerContext';

export type Handler<GEA, R = ApiGatewayProxyResponse> = (
  event: ApiGatewayProxyEvent,
  context?: HandlerContext<GEA>
) => Promise<R>;
