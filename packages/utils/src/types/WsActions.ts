import { WsHandler } from './WsHandler';

export type Actions = { [action: string]: WsHandler<any> };
