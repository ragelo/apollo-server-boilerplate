import { GraphQLObjectType } from 'graphql';
import { Context } from '../context';
import NodeGQLType from './node';
import ViewerGQLType from './viewer';

const QueryGQLType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: NodeGQLType,
    viewer: {
      type: ViewerGQLType,
      resolve(_: any, args: any, context: Context) {
        return {
          id: context.auth().subjectId,
          user: {
            id: context.auth().subjectId,
          },
        };
      },
    },
  }),
});
export default QueryGQLType;
