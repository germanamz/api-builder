import './Request';

import express from 'express';

const app = express();

app.use((req, res, next) => {
  const bodyData: Buffer[] = [];

  req.on('data', (chunk) => {
    bodyData.push(chunk);
  });
  req.on('end', () => {
    if (bodyData.length) {
      req.rawBody = Buffer.concat(bodyData);
    }
    next();
  });
});

app.use((req, res, next) => {
  const contentType = req.header('content-type');

  switch (contentType) {
    case 'application/json':
      req.body = req.rawBody && JSON.parse(req.rawBody.toString());
      break;
    case 'application/octet-stream':
      req.body = req.rawBody?.toString('base64') || null;
      break;
    default:
      req.body = req.rawBody?.toString() || null;
  }

  next();
});

export default app;
