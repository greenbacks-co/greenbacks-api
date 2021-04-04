import logger from 'logger';
import { Connections } from 'storage/models';

const mutations = {
  createConnection: async (
    _,
    { input: { token } },
    { dataSources: { financeClient, storageClient }, environment, user }
  ) => {
    const {
      accessToken,
      id,
    } = await financeClient.exchangeTemporaryConnectionToken({
      token,
    });
    const { name } = await financeClient.describeConnection({
      token: accessToken,
    });
    const connections = new Connections({ environment, storageClient, user });
    await connections.create({
      id,
      name,
      token: accessToken,
    });
    logger.info('stored new connection');
    return { id, institution: { name } };
  },
};

const queries = {
  getConnectionInitializationToken: async (
    _source,
    _args,
    { dataSources: { financeClient } }
  ) => financeClient.createConnectionInitializationToken({ id: 'test-user' }),
  getConnections: async (
    _source,
    _args,
    { dataSources: { storageClient }, environment, user }
  ) => {
    const connections = new Connections({ environment, storageClient, user });
    return connections.list();
  },
  getTransactions: async (
    _source,
    _args,
    { dataSources: { financeClient, storageClient }, environment, user }
  ) => {
    const connections = new Connections({ environment, storageClient, user });
    const savedConnections = await connections.list();
    return financeClient.listTransactions({
      end: '2021-01-31',
      start: '2021-01-01',
      token: savedConnections[0].token,
    });
  },
};

const resolvers = {
  Mutation: {
    ...mutations,
  },
  Query: {
    ...queries,
  },
};

export default resolvers;
