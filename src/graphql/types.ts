import {gql} from 'apollo-server-express';
import {schema as RootQuerySchema} from './schema/root-query';
import {schema as UserSchema} from './schema/user';
import {schema as ViewerSchema} from './schema/viewer';


const SchemaDefinition = gql`
  schema {
    query: RootQuery
  }
`;

const types = [
  SchemaDefinition,

  RootQuerySchema,
  ViewerSchema,
  UserSchema,
];
export default types;
