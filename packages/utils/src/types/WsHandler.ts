import { HandlerResponse } from './HandlerResponse';
import { WsEvent } from './WsEvent';

export type WsHandler<R = HandlerResponse> = (
  event: WsEvent,
  ctx?: any
) => Promise<R>;
