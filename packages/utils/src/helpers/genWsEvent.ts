import { WsConnection } from '../types/WsConnection';
import { WsEvent } from '../types/WsEvent';
import genWsReqContext from './genWsReqContext';

const genWsEvent = (
  connection: WsConnection,
  routeKey: string,
  eventType: WsEvent['requestContext']['eventType'],
  data?: any
): WsEvent => ({
  headers: {},
  isBase64Encoded: false,
  multiValueHeaders: {},
  body: data,
  requestContext: genWsReqContext(connection, routeKey, eventType),
});

export default genWsEvent;
