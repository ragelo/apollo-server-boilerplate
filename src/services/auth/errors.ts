import { BaseError } from '../../errors/base-error';

export abstract class AuthError extends BaseError {
  constructor(message: string, code: string, args?: any) {
    super('message', code, args);
  }
}

export class InvalidBasicToken extends AuthError {
  constructor() {
    const code = 'AUTH_INVALID_BASIC_TOKEN';
    // TODO: get message by code
    super('Message', code);
  }
}

export class InvalidCredentials extends AuthError {
  constructor() {
    const code = 'AUTH_INVALID_CREDENTIALS';
    // TODO: get message by code
    super('Message', code);
  }
}
