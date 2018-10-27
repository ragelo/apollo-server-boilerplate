import { Request, Response } from 'express';
import {v4 as uuidV4 } from 'uuid';
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
  auth: AuthContext | null;
  authError: Error | null;
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

    this._authContext = options.auth;
    this._authError = options.authError;
    this.reqStartTime = options.reqStartTime;
  }

  private _authContext: AuthContext | null;
  private _authError: Error | null;

  // Services
  private _logger: Logger | null = null;

  auth(): AuthContext {
    if (this._authError) {
      throw this._authError;
    }
    if (!this._authContext) {
      throw new Error('Client not found');
    }

    return this._authContext;
  }

}

export async function makeContext(req: Request, res: Response): Promise<Context> {
  const reqStartTime = new Date();

  let auth: AuthContext | null = null;
  let authError: Error | null = null;

  try {
    auth = await checkBearerToken(req, res);
  } catch (e) {
    authError = e;
  }

  return new Context(req, res, {
    auth,
    authError,
    reqStartTime,
  });
}
