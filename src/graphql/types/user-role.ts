import { GraphQLEnumType, GraphQLEnumValueConfig } from 'graphql';

export enum UserRole {
  GUEST = 'GUEST',
  STANDART = 'STANDART',
}

interface GQLEnumValueConfig<R> extends GraphQLEnumValueConfig {
  value: R;
}

type UserRoleToGraphQL = {
  [Role in keyof typeof UserRole]: GQLEnumValueConfig<Role>;
};

const values: UserRoleToGraphQL = {
  GUEST: {
    value: UserRole.GUEST,
  },
  STANDART: {
    value: UserRole.STANDART,
  },
}

const UserRoleGQLType = new GraphQLEnumType({
  name: 'UserRole',
  values,
});
export default UserRoleGQLType;
