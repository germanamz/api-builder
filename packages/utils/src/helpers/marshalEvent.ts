import ApiGatewayProxyEvent from '../types/ApiGatewayProxyEvent';
import HandlerEvent from '../types/HandlerEvent';

const marshalEvent =
  <C extends { isDev: boolean }>(buildCtx: C = {} as C) =>
  (event: ApiGatewayProxyEvent): HandlerEvent => ({
    ...event,
    body:
      !buildCtx.isDev &&
      (event.headers['Content-Type'] === 'application/json' ||
        event.headers['content-type'] === 'application/json')
        ? JSON.parse(event.body)
        : event.body,
  });

export default marshalEvent;
