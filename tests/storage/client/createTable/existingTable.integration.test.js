import 'babel-polyfill';

import { v4 as uuid } from 'uuid';

import StorageClient, { TableExistsError } from 'storage/client';
import {
  createTable,
  delay,
  DELAYS,
  deleteTablesAfterDelay,
  getCredentials,
} from '../../utils';

const TABLE_PREFIX = 'test-create-table-existing-table';

const getInput = (name) => ({
  key: {
    partition: {
      name: 'id',
      type: 'number',
    },
  },
  name,
});

afterAll(async () => {
  await deleteTablesAfterDelay(TABLE_PREFIX);
}, DELAYS.deleteTables);

test(
  'create table with table being created throws existing table error',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    const credentials = getCredentials();
    const input = getInput(name);
    const client = new StorageClient({ credentials });
    await createTable(name);
    await delay(DELAYS.createTable);
    expect(async () => {
      await client.createTable(input);
    }).rejects.toThrow(TableExistsError);
  },
  DELAYS.longTest
);

test('create table with existing table throws existing table error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const input = getInput(name);
  const client = new StorageClient({ credentials });
  await createTable(name);
  expect(async () => {
    await client.createTable(input);
  }).rejects.toThrow(TableExistsError);
});
