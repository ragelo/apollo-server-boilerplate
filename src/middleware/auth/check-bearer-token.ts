import * as express from 'express';

import { AuthContext } from '../../graphql/context';
import {getUserById} from '../../models/user';
import {AccessTokenPayload, decodeAccessToken} from './crypto';

interface AuthErrorOptions {
  httpStatus: number;
  code: string;
  message?: string;
}

class AuthError extends Error {
  status: number;
  code: string;

  constructor(error: AuthErrorOptions) {
    super(error.message);
    this.status = error.httpStatus;
    this.code = error.code;
  }
}

function isAuthTokenExpired(accessTokenPayload: AccessTokenPayload): boolean {
  return accessTokenPayload.expires !== null && (
    !accessTokenPayload.expires || new Date(accessTokenPayload.expires * 1000) < new Date()
  )
}

export async function checkBearerToken(req: /* FIXME */ any, res: express.Response): Promise<AuthContext> {
  const headerToken = req.get('Authorization');
  if (!headerToken) {
    throw new AuthError({
      httpStatus: 401,
      code: 'NotAuthorized',
      message: 'NotAuthorized'
    })
  }

  const matches = headerToken.match(/[bB]earer\s(\S+)/);
  if (!matches) {
    throw new AuthError({
      httpStatus: 401,
      code: 'NotAuthorized',
      message: 'NotAuthorized'
    });
  }

  const bearerToken = matches[1];

  const accessTokenPayload = decodeAccessToken(bearerToken);
  if (!accessTokenPayload) {
    throw new AuthError({
      httpStatus: 401,
      code: 'BadAuthToken',
      message: 'BadAuthToken'
    });
  }

  if (isAuthTokenExpired(accessTokenPayload)) {
    throw new AuthError({
      httpStatus: 401,
      code: 'AuthTokenExpired',
      message: 'AuthTokenExpired'
    });
  }

  const user = await getUserById(accessTokenPayload.user.id);

  if (!user || user.deletedAt) {
    throw new AuthError({
      httpStatus: 401,
      code: 'UserDeactivatedOrNotExist',
      message: 'UserDeactivatedOrNotExist'
    });
  }

  req.auth.subjectId = user.id;
  req.auth.roles = user.roles;
  req.auth.user = user;

  return {
    subjectId: user.id,
    user,
    roles: user.roles,
  }
}

export async function checkBearerTokenMiddleware(req: /* FIXME */ any, res: express.Response, next: express.NextFunction) {
  try {
    req.auth = await checkBearerToken(req, res);
    next();
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(error.status).json({
        error: {
          code: error.code,
        },
        message: error.message,
        name: error.name,
      });
    } else {
      res.status(500).json({
        message: error.message,
        name: error.name,
      });
    }
  }
}
