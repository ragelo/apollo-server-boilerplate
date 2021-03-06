import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getUserById, User } from '../../models/user';
import { Context } from '../context';
import UserGQLType from './user';

const ViewerGQLType = new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    user: {
      type: new GraphQLNonNull(UserGQLType),
      async resolve(source: any): Promise<User> {
        const user = await getUserById(source.id);
        if (user) {
          return user;
        }
        throw new Error(`User ${source.id} not found.`);
      }
    },
    ip: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(source, args, context: Context): string {
        return context.ip;
      },
    }
  })
});
export default ViewerGQLType;
