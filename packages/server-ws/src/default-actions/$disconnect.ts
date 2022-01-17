import { WsHandler } from '@the-api-builder/utils';

const def: WsHandler<{ connectionId: string }> = async ({
  requestContext: { connectionId },
}) => ({
  connectionId,
});

export default def;
