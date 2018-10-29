import { BaseError } from '../../errors/base-error';

export abstract class AuthError extends BaseError {
  constructor(message: string, code: string, args?: any) {
    super(message, 'AUTH__' + code, args);
    this.apiVisible = true;
  }
}

export class InvalidBasicTokenError extends AuthError {
  constructor() {
    const code = 'INVALID_BASIC_TOKEN';
    super('Invalid basic token', code);
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    const code = 'INVALID_CREDENTIALS';
    super('Invalid auth credentials', code);
  }
}

export class NotAuthorizedError extends AuthError {
  constructor() {
    const code = 'NOT_AUTHORIZED';
    super('Auth token not found', code);
  }
}

export class BadAuthTokenError extends AuthError {
  constructor() {
    const code = 'BAD_AUTH_TOKEN';
    super('Invalid auth token', code);
  }
}

export class AuthTokenExpiredError extends AuthError {
  constructor() {
    const code = 'AUTH_TOKEN_EXPIRED';
    super('Auth token expired', code);
  }
}

export class UserDeactivatedOrNotExistError extends AuthError {
  constructor() {
    const code = 'USER_DEACTIVATED_OR_NOT_EXISTS';
    super('Auth user not exists or deactivated', code);
  }
}
