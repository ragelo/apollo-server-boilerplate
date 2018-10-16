import {Response} from 'express';
import logger, {Logger} from '../logger';
import {checkBearerToken} from '../middleware/auth/check-bearer-token';
import {User} from '../models/user';
import { UserRoleType } from './types/user-role';

export interface AuthContext {
  subjectId: number;
  user: User;
  roles: UserRoleType[];
}

export interface Context {
  requestId: string;
  ip: string;

  userAgent?: string;
  countryCode?: string;
  requestStartTime: Date;

  logger: Logger;

  auth(): AuthContext;
}

export async function makeContext(req: /* FIXME */ any, res: Response): Promise<Context> {
  const requestStartTime = new Date();

  let auth: AuthContext;
  let authError: Error;
  try {
    auth = await checkBearerToken(req, res);
  } catch (e) {
    authError = e;
  }

  return {
    requestStartTime,
    logger,
    requestId: req.requestId,
    ip: req.ip,
    userAgent: req.header('User-Agent'),
    auth() {
      if (authError) {
        throw authError;
      }

      return auth;
    }
  };
}
