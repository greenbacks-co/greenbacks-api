import Connections from 'storage/models/connections';
import TransactionUpdates from 'storage/models/transactionUpdates';
import logger from 'utils/logger';

const JANUARY_FIRST_TWO_THOUSAND = '2000-01-01T00:00:00';

const updateTransactions = async (
  _source,
  _args,
  { dataSources: { _financeClient, storageClient }, environment, user }
) => {
  logger.info('update transactions');
  // fetch last update
  const updates = new TransactionUpdates({
    environment,
    storageClient,
    user,
  });
  const latestUpdate = await updates.getLatest();
  // if not done
  //   abort
  /*
  if (!latestUpdate.finishedDate)
    return { status: 'update already in progress' };
  */
  // fetch connections
  const connections = new Connections({ environment, storageClient, user });
  const savedConnections = await connections.list();
  // create new update
  const connectionIds = savedConnections.map(({ id }) => id);
  /*
  await updates.create({ connections: connectionIds });
  */
  // calculate time range for each connection
  const startTimesByConnectionId = {};
  connectionIds.forEach((connectionId) => {
    if (latestUpdate.connections.includes(connectionId))
      startTimesByConnectionId[connectionId] = latestUpdate.createdDate;
    else startTimesByConnectionId[connectionId] = JANUARY_FIRST_TWO_THOUSAND;
  });
  logger.info(startTimesByConnectionId);
  // fetch stored pending transactions
  // for each connection
  //   fetch new transactions
  //   for each transaction
  //     if pending
  //       save to pending
  //     if posted
  //       save to posted
  //       if has pending match
  //         remove pending
  // get pending transactions outside updated ranges
  // for each
  //   if no longer exists in plaid
  //     move to holds
  // mark update as successful
  // if error
  //   mark update as error
  //
  // rollback on error?
  /*
    savedConnections.forEach(async (connection) => {
      const transactions = await financeClient.listTransactions({
        end: DateTime.now().endOf('month').toISODate(),
        start: DateTime.now().startOf('year').toISODate(),
        token: savedConnections[0].token,
      });
    });
    */
  return { status: 'success' };
};

export default updateTransactions;
