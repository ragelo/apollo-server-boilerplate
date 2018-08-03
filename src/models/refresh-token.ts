export interface RefreshToken {
  id: string;
  value: string;
  expires: number;
}

interface RefreshTokenModel extends RefreshToken {}

const tokens: RefreshTokenModel[] = [];

export async function saveRefreshToken(id: string, token: string, expires: number): Promise<RefreshToken> {
  const tokenModel = {
    id,
    expires,
    value: token,
  };
  tokens.push(tokenModel);
  return tokenModel;
}

export async function getRefreshToken(id: string): Promise<RefreshToken | undefined> {
  return tokens.find(token => token.id === id);
}
