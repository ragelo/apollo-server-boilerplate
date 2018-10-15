import { GraphQLObjectType } from 'graphql';
import LoginGQLMutation from '../mutations/login';

const MytationGQLType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        login: LoginGQLMutation,
    },
});
export default MytationGQLType;
