export type ApiGatewayProxyResponse = {
  statusCode: string;
  headers: { [hear: string]: string };
  body: string;
  isBase64Encoded: boolean;
};
