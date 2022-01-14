import { WsConnection, WsEvent } from '@the-api-builder/utils';
import { randomBytes } from 'crypto';
import { WebSocket } from 'ws';

export const connections: {
  [id: string]: { data: WsConnection; ws: WebSocket };
} = {};

export const addConnection = (
  ws: WebSocket,
  identity: WsEvent['requestContext']['identity']
): WsConnection => {
  const connectionId = randomBytes(11).toString('base64');
  const requestId = randomBytes(11).toString('base64');
  const connectedAt = new Date();
  const connection = {
    data: {
      connectionId,
      requestId,
      connectedAt: connectedAt.getTime(),
      identity,
    },
    ws,
  };
  connections[connectionId] = connection;

  return connection.data;
};

export const removeConnection = (id: string) => {
  delete connections[id];
};
