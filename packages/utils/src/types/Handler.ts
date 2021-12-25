import ApiGatewayProxyResponse from './ApiGatewayProxyResponse';
import HandlerEvent from './HandlerEvent';

type Handler<R = ApiGatewayProxyResponse> = (
  event: HandlerEvent,
  context: any
) => Promise<R>;

export default Handler;
