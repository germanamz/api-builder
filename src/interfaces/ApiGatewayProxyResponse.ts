export type ApiGatewayProxyResponse = {
  statusCode: string | number;
  headers: { [hear: string]: string };
  body: string;
  isBase64Encoded: boolean;
};
