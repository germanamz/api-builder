import { WsHandler } from './WsHandler';

export type WsActions = { [action: string]: WsHandler<any> };
