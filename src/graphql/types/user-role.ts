import { GraphQLEnumType, GraphQLEnumValueConfig } from 'graphql';

export enum UserRole {
  GUEST = 'GUEST',
  STANDART = 'STANDART',
}

type UserRoleType = Extract<keyof typeof UserRole, string>

interface GQLEnumValueConfig<Role> extends GraphQLEnumValueConfig {
  value: Role;
}

type UserRoleGraphQLConfig = {
  [Role in UserRoleType]: GQLEnumValueConfig<Role>;
};

const values: UserRoleGraphQLConfig = {
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
