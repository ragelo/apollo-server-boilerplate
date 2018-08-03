import * as express from 'express';
import {getAuthClient} from '../../models/auth-client';
import {checkUserPassword, User} from '../../models/user';
import {parseBasicToken} from './check-basic-token';
import {encodeAccessToken, encodeRefreshToken} from './crypto';

const allowedGrantTypes = ['password'];

export async function tokenHandler(req: /* FIXME */ any, res: express.Response, next: express.NextFunction) {
  if (req.method !== 'POST' || !req.is('application/json')) {
    res.status(400).json({
      error: {
        code: 'BadData',
      },
      message: 'BadData',
    });
    return;
  }

  const grantType = req.body.grant_type;
  if (!grantType || !grantType.match(allowedGrantTypes)) {
    res.status(400).json({
      error: {
        code: 'BadGrantType',
      },
      message: 'BadGrantType',
    });
    return;
  }

  const clientData = parseBasicToken(req);

  if (!clientData || !clientData.id || !clientData.secret) {
    res.status(400).json({
      error: {
        code: 'InvalidBasicToken',
      },
      message: 'InvalidBasicToken',
    });
    return;
  }

  const client = await getAuthClient(clientData.id);

  if (!client || client.secret !== clientData.secret) {
    res.status(400).json({
      error: {
        code: 'InvalidBasicToken',
      },
      message: 'InvalidBasicToken',
    });
    return;
  }

  req.auth.clientId = client.id;
  const user = await authorizeUseGrantType(grantType, req, res);

  if (!user) {
    return;
  }

  req.auth.subjectId = user.id;
  req.auth.role = user.role;
  req.auth.user = user;

  const refreshToken = await encodeRefreshToken({user});
  const accessToken = encodeAccessToken({
    user, refreshTokenRef: refreshToken.id,
  }, client.id);

  const response = {
    token_type: 'bearer',
    access_token: accessToken.token,
    expires_in: accessToken.expires,
    refresh_token: refreshToken.token,
    user_role: user.role
  };

  res.set({'Cache-Control': 'no-store', 'Pragma': 'no-cache'});
  res.jsonp(response);
}

export default tokenHandler;

async function authorizeUseGrantType(grantType: string, req: express.Request, res: express.Response): Promise<User | undefined> {
  if (grantType === 'password') {
    const {
      username,
      password
    } = req.body;

    if (!username || !password) {
      res.status(400).json({
        error: {
          code: 'InvalidCredentials',
        },
        message: 'InvalidCredentials',
      });
      return;
    }

    const authorizedUser = await checkUserPassword(username, password);

    if (!authorizedUser) {
      res.status(400).json({
        error: {
          code: 'InvalidCredentials',
        },
        message: 'InvalidCredentials',
      });
      return;
    }
    return authorizedUser;
  }

  res.status(500).json({
    error: {
      code: 'NotImplemented',
    },
    message: 'NotImplemented',
  });
}
