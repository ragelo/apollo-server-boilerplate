import {Request} from 'express';

import {AuthClient} from '../../models/auth-client';

export function parseBasicToken(req: Request): AuthClient | undefined {
  let auth: any = req.headers.authorization;

  if (!auth) {
    return;
  }

  const parts = auth.split(' ');
  if ('basic' !== parts[0].toLowerCase() || !parts[1]) {
    return;
  }
  auth = parts[1];

  auth = new Buffer(auth, 'base64').toString();
  auth = auth.match(/^([^:]+):(.+)$/);

  if (!auth) {
    return;
  }

  return {
    id: auth[1],
    secret: auth[2],
  };
}
