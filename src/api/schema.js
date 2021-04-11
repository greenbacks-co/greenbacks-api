import { gql } from 'api/graphql';

const schema = gql`
  type Connection {
    id: ID!
    institution: Institution!
  }

  input CreateConnectionInput {
    token: String!
  }

  type Institution {
    name: String!
  }

  type Transaction {
    amount: Float!
    date: String!
    name: String!
  }

  type UpdateTransactionsResponse {
    status: String!
  }

  type Mutation {
    createConnection(input: CreateConnectionInput!): Connection
    updateTransactions: UpdateTransactionsResponse
  }

  type Query {
    getConnectionInitializationToken: String!
    getConnections: [Connection]
    getTransactions: [Transaction]
  }
`;

export default schema;
