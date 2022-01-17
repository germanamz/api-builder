import { HandlerResponse } from './HandlerResponse';
import { RestHandlerEvent } from './RestHandlerEvent';

export type RestHandler<R = HandlerResponse> = (
  event: RestHandlerEvent,
  context: any
) => Promise<R>;
