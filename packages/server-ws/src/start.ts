import { WsHandler } from '@the-api-builder/utils';

import { addAction } from './runner';
import { httpServer, wsServer } from './server';

const start = async (
  actions: Array<[string, WsHandler<any>]>,
  port: string = '3001'
) => {
  actions.forEach(([action, handler]) => addAction(action, handler));

  return new Promise((resolve) => {
    httpServer.listen(port, () => {
      resolve({ httpServer, wsServer });
    });
  });
};

export default start;
