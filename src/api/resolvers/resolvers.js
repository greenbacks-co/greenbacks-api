import Connections from 'storage/models/connections';
import DateTime from 'utils/datetime';
import logger from 'utils/logger';

import updateTransactions from './updateTransactions';

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
  updateTransactions,
  /*
  : async (
    _source,
    _args,
    { dataSources: { financeClient, storageClient }, environment, user }
  ) => {
    logger.info('update transactions');
    const updates = new TransactionUpdates({
      environment,
      storageClient,
      user,
    });
    const latestUpdate = await updates.getLatest();
    logger.info(latestUpdate);
    const connections = new Connections({ environment, storageClient, user });
    const savedConnections = await connections.list();
    if (latestUpdate.finishedDate) {
      const connectionIds = savedConnections.map(({ id }) => id);
      await updates.create({ connections: connectionIds });
    }
    /*
    savedConnections.forEach(async (connection) => {
      const transactions = await financeClient.listTransactions({
        end: DateTime.now().endOf('month').toISODate(),
        start: DateTime.now().startOf('year').toISODate(),
        token: savedConnections[0].token,
      });
    });
    */
  /*
    return { status: 'success' };
  },
  */
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
    const transactions = await financeClient.listTransactions({
      end: DateTime.now().endOf('month').toISODate(),
      start: DateTime.now().startOf('year').minus({ years: 2 }).toISODate(),
      token: savedConnections[0].token,
    });
    logger.info(transactions);
    return transactions;
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
