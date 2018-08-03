import {ApolloServer} from 'apollo-server-express';

import logger from '../logger';
import {makeContext} from './context';
import resolvers from './resolvers';
import {default as typeDefs} from './types';


export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context({req, res}: any) {
    return makeContext(req, res);
  },
  formatError(error: any) {
    logger.error(error);
    return error;
  },
  formatResponse(response: any) {
    logger.log(response);
    return response;
  },
});
