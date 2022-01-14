import { parseJson, WsMessage } from '@the-api-builder/utils';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

import { addConnection } from './connections';
import { runAction } from './runner';

const httpServer = createServer();
const wsServer = new WebSocketServer({ server: httpServer });

httpServer.on('request', (req, res) => {
  if (req.method === 'POST' && req.url === '/@connections') {
    console.log(req);
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

wsServer.on('connection', async (ws, req) => {
  const connection = addConnection(ws, {
    sourceIp: req.socket.remoteAddress as string,
  });

  await runAction('$connect', undefined, connection, 'CONNECT');

  ws.on('message', async (messageStr: string = '{}') => {
    const { action, data }: WsMessage = parseJson(messageStr);
    const resData = await runAction(action, data, connection, 'MESSAGE');
    ws.send(resData);
  });

  ws.on('close', async () => {
    await runAction('$disconnect', undefined, connection, 'DISCONNECT');
  });
});

export { httpServer, wsServer };
