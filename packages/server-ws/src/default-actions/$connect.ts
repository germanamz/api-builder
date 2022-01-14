import { WsHandler } from '@the-api-builder/utils';

const connect: WsHandler<{ connectionId: string }> = async ({
  requestContext: { connectionId },
}) => ({
  connectionId,
});

export default connect;
