import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { User } from '../../models/user';
import { NodeGQLInterface, toGlobalId } from './node';
import UserRoleGQLType, { UserRole } from './user-role';

const UserGQLType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve(source: User): string {
        return toGlobalId('User', source.id);
      }
    },
    roles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserRoleGQLType))),
      resolve(source: User): UserRole[] {
        return source.roles;
      }
    },
    username: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(source: User): string {
        return source.username;
      }
    },
    profilePictureUrl: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(source: User) {
        const hash = Buffer.from(source.username).toString('base64');
        return `https://www.gravatar.com/avatar/${hash}?d=retro`;
      },
    }
  }),
  interfaces: [NodeGQLInterface],
});
export default UserGQLType;
