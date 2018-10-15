import { GraphQLSchema } from 'graphql';
import MutationGQLType from './types/mutation';
import QueryGQLType from './types/query';

const schema = new GraphQLSchema({
  query: QueryGQLType,
  mutation: MutationGQLType,
});
export default schema;
