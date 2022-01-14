import { ApiGatewayProxyEvent } from './ApiGatewayProxyEvent';

export type HandlerEvent = ApiGatewayProxyEvent & {
  body: any;
};
