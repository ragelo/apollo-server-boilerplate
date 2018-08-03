import {gql} from 'apollo-server';
import {Context} from '../context';

export const schema = gql`
  type RootQuery {
    viewer: Viewer
  }
`;

export const resolver = {
  viewer(_: any, args: any, context: Context) {
    return {
      id: context.subjectId,
      profile: {
        id: context.subjectId,
        role: context.role,
      },
    };
  },
};
