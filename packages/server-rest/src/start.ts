import { opWrapper, RestHandler } from '@the-api-builder/utils';
import bodyParser from 'body-parser';
import { initialize } from 'express-openapi';

import app from './app';
import server from './server';

const start = async (
  apiDoc: any,
  operations: Array<[name: string, handler: RestHandler]>,
  schemas: any,
  port: string = '3000'
) => {
  const ops: any = {
    'cors-operation': opWrapper(async () => ({
      statusCode: 200,
      body: 'ok',
      isBase64Encoded: false,
      headers: {},
    })),
  };

  for await (const [name, handler] of operations) {
    ops[name] = opWrapper(handler);
  }

  initialize({
    app,
    apiDoc,
    externalSchemas: schemas,
    operations: ops,
    consumesMiddleware: {
      'application/json': bodyParser.json(),
      'text/text': bodyParser.text(),
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    errorMiddleware(err, req, res, next) {
      const { status } = err;
      console.log(err);
      res.status(err.status);
      if (status === 400) {
        res.json({
          message: 'Invalid request body',
        });
      } else {
        res.json(err);
      }
    },
  });
  return new Promise((resolve) => {
    server.listen(port, () => {
      resolve({ server, app });
    });
  });
};

export default start;
