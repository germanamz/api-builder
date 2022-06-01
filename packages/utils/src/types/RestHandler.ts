import AsResponseObject from '../constants/AsResponseObject';
import { HandlerResponse } from './HandlerResponse';
import { RestHandlerEvent } from './RestHandlerEvent';

export type RestHandler<
  R = string | Object | (HandlerResponse & { [AsResponseObject]: boolean })
> = (event: RestHandlerEvent, context: any) => Promise<R>;
