export type HandlerResponse = {
  statusCode: number;
  headers?: Record<string, string | string[]>;
  body?: string;
  isBase64Encoded?: boolean;
};
