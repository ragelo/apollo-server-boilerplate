if (process.env.SQREEN_TOKEN) {
  // tslint:disable-next-line:no-var-requires
  require('sqreen');
}

import * as fs from 'fs';
import { createServer } from 'http';

import config from './config';
import app from './index';
import logger from './logger';

const server = createServer(app);

let mask: number | null = process.umask(0);

if (typeof config.port === 'string') {
  if (fs.existsSync(config.port)) {
    fs.unlinkSync(config.port);
  }
}

async function start() {
  return new Promise((resolve, reject) => {
    server.listen(config.port, (error: any) => {
      if (error) {
        reject(error);
      }

      if (typeof config.port === 'string') {
        fs.chmodSync(config.port, '777');
        fs.writeFileSync('/tmp/app-initialized', '');
        logger.info('/tmp/app-initialized');
      }

      if (mask) {
        mask = null;
      }
      resolve();
    });
  }).then(() => {
    logger.info(`Listening on ${config.port}`);
  });
}


if (require.main === module) {
  start().catch((error) => {
    process.exit(1);
  });
}
