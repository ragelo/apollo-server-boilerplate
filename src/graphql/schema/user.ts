import {gql} from 'apollo-server';
import {SubjectRole} from '../../middleware/auth';
import {User} from '../../models/user';
import {toGlobalId} from '../helpers';


export const schema = gql`
  type User {
    id: ID!
    roles: [String!]!
    username: String!
    profilePictureUrl: String!
  }
`;

export const resolver = {
  id(source: User): string {
    return toGlobalId('User', source.id);
  },
  roles(source: User): SubjectRole[] {
    return [source.role];
  },
  username(source: User): string {
    return source.username;
  },
  profilePictureUrl(source: User) {
    const hash = Buffer.from(source.username).toString('base64');
    return `https://www.gravatar.com/avatar/${hash}?d=retro`;
  },
};
