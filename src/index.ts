if (process.env.SQREEN_TOKEN) {
  // tslint:disable-next-line:no-var-requires
  require('sqreen');
}

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as fs from 'fs';
import * as http from 'http';

import config from './config';
import {apolloServer} from './graphql';
import logger, {expressLogger} from './logger';
import auth from './middleware/auth';
import {cors} from './middleware/cors';

const app = express();
const server = http.createServer(app);

let mask: number | null = process.umask(0);
if (typeof config.port === 'string') {
  if (fs.existsSync(config.port)) {
    fs.unlinkSync(config.port);
  }
}


// Express configurations
app.use(expressLogger('info', res => res.statusCode < 400));
app.use(expressLogger('warn', res => res.statusCode >= 400 && res.statusCode < 500));
app.use(expressLogger('error', res => res.statusCode >= 500));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// TODO: bearer auth

app.use(cors);
app.use(auth());

apolloServer.applyMiddleware({app});

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

// Start server
server.listen(config.port, () => {
  if (typeof config.port === 'string') {
    fs.chmodSync(config.port, '777');
    fs.writeFileSync('/tmp/app-initialized', '');
    logger.info('/tmp/app-initialized');
  }

  if (mask) {
    mask = null;
  }

  console.log(`Listening on ${config.port}`);
});
