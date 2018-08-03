import {resolver as RootQuery} from './schema/root-query'
import {resolver as User} from './schema/user'
import {resolver as Viewer} from './schema/viewer'

const resolvers = {
  RootQuery,
  User,
  Viewer,
};
export default resolvers;
