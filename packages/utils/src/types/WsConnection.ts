import { WsEvent } from './WsEvent';

export type WsConnection = {
  connectionId: WsEvent['requestContext']['connectionId'];
  requestId: WsEvent['requestContext']['requestId'];
  connectedAt: WsEvent['requestContext']['connectedAt'];
  identity: WsEvent['requestContext']['identity'];
};
