import { ApolloError } from 'apollo-server';


export abstract class BaseError<Args = any> extends ApolloError {
  apiVisible = false;

  constructor(message: string = BaseError.name, code: string, args?: Args) {
    super(
      message,
      code,
      args,
    );
  }
}
