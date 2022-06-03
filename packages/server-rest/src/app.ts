import bodyParser from 'body-parser';
import express from 'express';

const app = express();

app.use(
  bodyParser.raw({
    type: '*/*',
  })
);

export default app;
