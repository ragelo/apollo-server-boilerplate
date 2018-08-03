import {gql} from 'apollo-server';
import {getUserById, User} from '../../models/user';
import {toGlobalId} from '../helpers';

export const schema = gql`
  type Viewer {
    id: String!
    user: User!
  }
`;

export const resolver = {
  id(source: any): string {
    return toGlobalId('Viewer', source.id);
  },
  async user(source: any): Promise<User> {
    const user = await getUserById(source.id);
    if (user) {
      return user;
    }
    throw new Error(`User ${source.id} not found.`);
  },
};
