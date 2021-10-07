export type ApiGatewayProxyResponse = {
  statusCode: number;
  headers: { [hear: string]: string };
  body: string;
  isBase64Encoded: boolean;
};
