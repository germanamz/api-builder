import {
  genWsEvent,
  WsActions,
  WsConnection,
  WsEvent,
  WsHandler,
  wsHandlerWrapper,
} from '@the-api-builder/utils';

import connect from './default-actions/$connect';
import def from './default-actions/$default';
import disconnect from './default-actions/$disconnect';

export const actions: WsActions = {
  $connect: connect,
  $default: def,
  $disconnect: disconnect,
};

export const addAction = (action: string, handler: WsHandler) => {
  actions[action] = wsHandlerWrapper(handler);
};

export const runAction = async <D = any>(
  action: string,
  data: D,
  connection: WsConnection,
  eventType: WsEvent['requestContext']['eventType']
): Promise<any> => {
  let actionName = action;
  let handler = actions[action];

  if (!handler) {
    actionName = '$default';
    handler = actions.$default;
  }

  try {
    const res = await handler(genWsEvent(connection, actionName, eventType));
    if (typeof res === 'string') {
      return res;
    }
    if (res) {
      return JSON.stringify(res);
    }
  } catch (e) {
    console.error(e);
  }
  return undefined;
};
