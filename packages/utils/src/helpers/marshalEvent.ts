import { RestEvent } from '../types/RestEvent';
import { RestHandlerEvent } from '../types/RestHandlerEvent';

const marshalEvent =
  <C extends { isDev: boolean }>(buildCtx: C = {} as C) =>
  (event: RestEvent): RestHandlerEvent => ({
    ...event,
    body:
      !buildCtx.isDev &&
      (event.headers['Content-Type'] === 'application/json' ||
        event.headers['content-type'] === 'application/json')
        ? JSON.parse(event.body)
        : event.body,
  });

export default marshalEvent;
