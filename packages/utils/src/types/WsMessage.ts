export type WsMessage<D = any> = {
  action: string;
  data: D;
};
