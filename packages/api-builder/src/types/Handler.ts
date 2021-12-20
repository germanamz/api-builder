import { ApiGatewayProxyResponse } from './ApiGatewayProxyResponse';
import HandlerContext from './HandlerContext';
import { PreparedApiGatewayProxyEvent } from './PreparedApiGatewayProxyEvent';

export type Handler<R = ApiGatewayProxyResponse> = (
  event: PreparedApiGatewayProxyEvent,
  context: HandlerContext
) => Promise<R>;
