import { WsConnection } from '../types/WsConnection';
import { WsEvent } from '../types/WsEvent';
import timeFormat from './timeFormat';

const genWsReqContext = (
  connection: WsConnection,
  routeKey: string,
  eventType: WsEvent['requestContext']['eventType'],
  messageDirection: WsEvent['requestContext']['messageDirection'] = 'IN'
): WsEvent['requestContext'] => {
  const requestTime = new Date();

  return {
    ...connection,
    extendedRequestId: connection.requestId,
    requestTime: timeFormat(requestTime),
    requestTimeEpoch: requestTime.getTime(),
    apiId: process.env.API_ID || 'localhost',
    stage: process.env.STAGE || 'localhost',
    domainName: process.env.DOMAIN_NAME || 'localhost',
    messageDirection,
    eventType,
    routeKey,
  };
};

export default genWsReqContext;
