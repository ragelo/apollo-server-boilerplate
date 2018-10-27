import * as bodyParser from 'body-parser';
import * as express from 'express';

import config from './config';
import { apolloServer } from './graphql';
import logger, { expressLogger } from './logger';
import { cors } from './middleware/cors';

const app = express();
export default app;

// Express configurations
app.use(expressLogger('info', res => res.statusCode < 400));
app.use(expressLogger('warn', res => res.statusCode >= 400 && res.statusCode < 500));
app.use(expressLogger('error', res => res.statusCode >= 500));

app.use(bodyParser.json());
app.use(cors);

apolloServer.applyMiddleware({
  app
});

app.use('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(400).send(new Error('route-not-found'));
});

// Express error handler
app.use((err: any, req: express.Request, res: express.Response) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.contentType('json');
  res.status(err.status || 500).send({
    message: err.message,
    error: config.isDevelopment ? err : {},
  });
});
