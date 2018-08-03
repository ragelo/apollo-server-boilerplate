import * as express from 'express';
import * as uuid from 'uuid';
import token from './token';

export type SubjectRole = 'guest' | 'user';


// Auth Controller
export default function auth() {
  return (req: /* FIXME */ any, res: express.Response, next: express.NextFunction) => {
    req.requestId = uuid.v4();
    req.auth = {};

    let handler;

    switch (req.path) {
      case '/auth/token':
        handler = token;
    }

    if (handler) {
      handler(req, res, next);
    } else {
      next();
    }
  };
}
