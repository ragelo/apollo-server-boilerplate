import {ApolloServer} from 'apollo-server-express';

import logger from '../logger';
import { makeContext } from './context';
import schema from './schema';


export const apolloServer = new ApolloServer({
  schema,
  context({req, res}: any) {
    return makeContext(req, res);
  },
  formatError(error: any) {
    logger.warn(error);
    return error;
  },
  formatResponse(response: any) {
    logger.log(response);
    return response;
  },
});
