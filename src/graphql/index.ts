import { ApolloServer } from 'apollo-server-express';
import { GraphQLError } from 'graphql';

import logger from '../logger';
import { makeContext } from './context';
import schema from './schema';


export const apolloServer = new ApolloServer({
  schema,
  context({req, res}: any) {
    return makeContext(req, res);
  },
  formatError(error: GraphQLError) {
    logger.warn(error);
    return error;
  },
  formatResponse(response: object) {
    logger.info(response);
    return response;
  },
});
