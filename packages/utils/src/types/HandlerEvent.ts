import ApiGatewayProxyEvent from './ApiGatewayProxyEvent';

type HandlerEvent = ApiGatewayProxyEvent & {
  body: any;
};

export default HandlerEvent;
