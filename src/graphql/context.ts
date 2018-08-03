import {Response} from 'express';
import logger, {Logger} from '../logger';
import {SubjectRole} from '../middleware/auth';
import {checkBearerToken} from '../middleware/auth/check-bearer-token';
import {User} from '../models/user';

export interface Context {
  requestId: string;
  subjectId: string;
  role: SubjectRole;

  user: User;

  userAgent?: string;
  countryCode?: string;

  requestStartTime: Date;

  logger: Logger;

}

export async function makeContext(req: /* FIXME */ any, res: Response): Promise<Context> {
  await checkBearerToken(req, res);
  const {
    subjectId,
    role,
    user,
  } = req.auth;

  const requestStartTime = new Date();

  return {
    requestStartTime,
    subjectId,
    user,
    role,
    logger,
    requestId: req.requestId,

    userAgent: req.header('User-Agent'),
  };
}
