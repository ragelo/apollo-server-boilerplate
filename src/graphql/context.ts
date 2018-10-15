import {Response} from 'express';
import logger, {Logger} from '../logger';
import {checkBearerToken} from '../middleware/auth/check-bearer-token';
import {User} from '../models/user';
import { UserRole } from './types/user-role';

export interface AuthContext {
  subjectId: string;
  roles: UserRole[];
  user: User;
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

  let authError: Error;
  try {
    await checkBearerToken(req, res);
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

      const {
        subjectId,
        roles,
        user,
      } = req.auth;

      return {
        subjectId,
        user,
        roles,
      }
    }
  };
}
