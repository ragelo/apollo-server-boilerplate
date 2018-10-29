import { Request, Response } from 'express';
import { v4 as uuidV4 } from 'uuid';
import logger, { Logger } from '../logger';
import { User } from '../models/user';
import { checkBearerToken } from '../services/auth/check-bearer-token';
import { UserRoleType } from './types/user-role';

export interface AuthContext {
  userId: number;
  user: User;
  roles: UserRoleType[];
}

interface ContextOptions {
  auth: AuthContext | Error;
  reqStartTime: Date;
}

export class Context {

  get logger() {
    if (!this._logger) {
      this._logger = logger;
    }

    return this._logger;
  }
  req: Request;
  res: Response;
  reqStartTime: Date;

  requestId: string;
  ip: string;

  userAgent?: string;
  countryCode?: string;

  constructor(req: Request, res: Response, options: ContextOptions) {
    this.req = req;
    this.res = res;

    this.ip = req.ip;
    this.userAgent = req.header('User-Agent');

    this.requestId = uuidV4();

    this._auth = options.auth;
    this.reqStartTime = options.reqStartTime;
  }

  private _auth: AuthContext | Error;

  // Services
  private _logger: Logger | null = null;

  auth(): AuthContext {
    if (this._auth instanceof Error) {
      throw this._auth;
    }

    return this._auth;
  }

}

export async function makeContext(req: Request, res: Response): Promise<Context> {
  const reqStartTime = new Date();
  let auth: AuthContext | Error;

  try {
    auth = await checkBearerToken(req, res);
  } catch (e) {
    auth = e;
  }

  return new Context(req, res, {
    auth,
    reqStartTime,
  });
}
