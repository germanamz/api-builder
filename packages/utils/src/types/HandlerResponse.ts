import AsResponseObject from '../constants/AsResponseObject';

export type HandlerResponse = {
  statusCode: number;
  [AsResponseObject]?: boolean;
  headers?: Record<string, string | string[]>;
  body?: string;
  isBase64Encoded?: boolean;
};
