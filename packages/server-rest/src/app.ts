import express from 'express';

const app = express();

app.use((req, res, next) => {
  const bodyData: Buffer[] = [];

  req.on('data', (chunk) => {
    bodyData.push(chunk);
  });
  req.on('end', () => {
    if (bodyData.length) {
      req.body = Buffer.concat(bodyData);
    }
    next();
  });
});

export default app;
