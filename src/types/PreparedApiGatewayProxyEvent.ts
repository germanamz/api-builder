import { ApiGatewayProxyEvent } from './ApiGatewayProxyEvent';

export type PreparedApiGatewayProxyEvent = ApiGatewayProxyEvent & {
  body: any;
};
