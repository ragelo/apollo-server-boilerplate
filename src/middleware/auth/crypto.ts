import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import config from '../../config';
import {saveRefreshToken} from '../../models/refresh-token';
import {SubjectRole} from './index';

export interface AccessTokenPayload {
  clientId: string;
  expires: number; // seconds
  user: {
    id: string;
    role: SubjectRole;
  };
  refreshTokenRef: string; // refreshToken.id
}

export function decodeAccessToken(bearerToken: string): AccessTokenPayload | undefined {
  let decoded: any;
  try {
    decoded = jwt.verify(bearerToken, config.auth.tokenSecret, {
      ignoreExpiration: true,
    });
  } catch (err) {
    return;
  }

  if (decoded.user && decoded.exp && decoded.sub && decoded.refreshTokenRef) {
    return {
      user: decoded.user,
      expires: decoded.exp,
      clientId: decoded.sub,
      refreshTokenRef: decoded.refreshTokenRef,
    };
  }
}

export interface DataForAccessToken {
  user: any;
  refreshTokenRef: string; // refreshToken.id
}

export interface EncodeResult {
  id: string;
  token: string;
  expires: number;
}

export function encodeAccessToken(
  data: DataForAccessToken,
  clientId: string,
  expires: number = config.auth.expires.access
): EncodeResult {
  const token = jwt.sign(data, config.auth.tokenSecret, {
    expiresIn: expires,
    subject: clientId,
  });

  return {
    id: data.refreshTokenRef,
    token,
    expires,
  }
}

export interface RefreshTokenPayload {
  id: string;
  user: {
    id: string;
    role: SubjectRole;
  },
  expires: number; // seconds
}

export function decodeRefreshToken(bearerToken: string): RefreshTokenPayload | undefined {
  let decoded: any;
  try {
    decoded = jwt.verify(bearerToken, config.auth.tokenSecret, {
      ignoreExpiration: true,
    });
  } catch (err) {
    return;
  }

  if (decoded.user && decoded.exp && decoded.sub && decoded.refreshTokenRef) {
    return {
      id: decoded.id,
      user: decoded.user,
      expires: decoded.exp,
    };
  }
}

export interface DataForRefreshToken {
  user: any;
}

export async function encodeRefreshToken(
  data: DataForRefreshToken,
  expires: number = config.auth.expires.refresh
): Promise<EncodeResult> {
  const id = uuid.v4();
  const token = jwt.sign({
    id,
    user: data.user,
  }, config.auth.tokenSecret, {
    expiresIn: expires,
  });

  await saveRefreshToken(id, token, expires);

  return {
    id,
    token,
    expires,
  }
}
