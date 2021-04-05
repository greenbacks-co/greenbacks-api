import { gql } from 'api/graphql';

const schema = gql`
  type Connection {
    id: ID!
    institution: Institution!
  }

  type Institution {
    name: String!
  }

  type Transaction {
    amount: Float!
    date: String!
    name: String!
  }

  input CreateConnectionInput {
    token: String!
  }

  type Mutation {
    createConnection(input: CreateConnectionInput!): Connection
  }

  type Query {
    getConnectionInitializationToken: String!
    getConnections: [Connection]
    getTransactions: [Transaction]
  }
`;

export default schema;
