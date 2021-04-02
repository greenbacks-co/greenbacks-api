import 'babel-polyfill';

import { v4 as uuid } from 'uuid';

import StorageClient, {
  AuthenticationError,
  MissingTableError,
} from 'storage/client';
import {
  createItem,
  createTable,
  DELAYS,
  deleteTablesAfterDelay,
  getCredentials,
} from '../utils';

const TABLE_PREFIX = 'test-storage-client-list-items';

const getInput = (table, partition) => ({
  key: {
    partition,
  },
  table,
});

afterAll(async () => {
  await deleteTablesAfterDelay(TABLE_PREFIX);
}, DELAYS.deleteTables);

test('list items with bad id in credentials throws authentication error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  credentials.id = 'bad';
  const client = new StorageClient({ credentials });
  const input = getInput(name, { id: 1 });
  await expect(async () => {
    await client.listItems(input);
  }).rejects.toThrow(AuthenticationError);
});

test('list items with bad secret in credentials throws authentication error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  credentials.secret = 'bad';
  const client = new StorageClient({ credentials });
  const input = getInput(name, { id: 1 });
  await expect(async () => {
    await client.listItems(input);
  }).rejects.toThrow(AuthenticationError);
});

test('list items with missing table throws missing table error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const client = new StorageClient({ credentials });
  const input = getInput(name, { id: 1 });
  await expect(async () => {
    await client.listItems(input);
  }).rejects.toThrow(MissingTableError);
});

test(
  'list items with partition key ignores items with different partition key',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    const credentials = getCredentials();
    const client = new StorageClient({ credentials });
    const input = getInput(name, { id: 2 });
    await createTable(name);
    await createItem(name, { id: 1, test: 'test' });
    const items = await client.listItems(input);
    expect(items).toStrictEqual([]);
  },
  DELAYS.longTest
);

test(
  'list items with partition key returns items with same partition key',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    const credentials = getCredentials();
    const client = new StorageClient({ credentials });
    const input = getInput(name, { id: 1 });
    await createTable(name);
    await createItem(name, { id: 1, test: 'test' });
    const items = await client.listItems(input);
    expect(items).toStrictEqual([{ id: 1, test: 'test' }]);
  },
  DELAYS.longTest
);
