import { ApiGatewayProxyEvent } from '../types/ApiGatewayProxyEvent';
import Context from '../types/Context';
import { PreparedApiGatewayProxyEvent } from '../types/PreparedApiGatewayProxyEvent';

const marshalEvent =
  (buildCtx: Context = {} as Context) =>
  (event: ApiGatewayProxyEvent): PreparedApiGatewayProxyEvent => ({
    ...event,
    body:
      !buildCtx.isDev &&
      (event.headers['Content-Type'] === 'application/json' ||
        event.headers['content-type'] === 'application/json')
        ? JSON.parse(event.body)
        : event.body,
  });

export default marshalEvent;
