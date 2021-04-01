import { gql } from 'api/graphql';

const schema = gql`
  type ConnectedInstitution {
    id: ID!
    name: String!
  }

  input ConnectInstitutionInput {
    token: String!
  }

  type Mutation {
    connectInstitution(input: ConnectInstitutionInput!): ConnectedInstitution
  }

  type Query {
    getConnectionInitializationToken: String!
    getConnectedInstitutions: [ConnectedInstitution]
  }
`;

export default schema;
