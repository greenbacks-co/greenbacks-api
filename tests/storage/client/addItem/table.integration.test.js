import 'babel-polyfill';

import { v4 as uuid } from 'uuid';

import { InputError } from 'errors';
import settings from 'settings';
import StorageClient, { MissingTableError } from 'storage/client';
import {
  createTable,
  delay,
  DELAYS,
  deleteTablesAfterDelay,
  getCredentials,
  getItem,
} from '../../utils';

const TABLE_PREFIX = 'test-add-item-table';

const getInput = (table) => ({
  credentials: {
    id: settings.STORAGE_ID,
    secret: settings.STORAGE_SECRET,
  },
  item: { id: 1 },
  table,
});

afterAll(async () => {
  await deleteTablesAfterDelay(TABLE_PREFIX);
}, DELAYS.deleteTables);

test('add item with missing table throws input error', async () => {
  const input = getInput();
  delete input.table;
  const credentials = getCredentials();
  const client = new StorageClient({ credentials });
  expect(async () => {
    await client.addItem(input);
  }).rejects.toThrow(InputError);
});

test('add item with empty table throws input error', async () => {
  const input = getInput();
  input.table = '';
  const credentials = getCredentials();
  const client = new StorageClient({ credentials });
  expect(async () => {
    await client.addItem(input);
  }).rejects.toThrow(InputError);
});

test('add item to missing table throws missing table error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const input = getInput(name);
  const credentials = getCredentials();
  const client = new StorageClient({ credentials });
  expect(async () => {
    await client.addItem(input);
  }).rejects.toThrow(MissingTableError);
});

test(
  'add item to existing table is successful',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    await createTable(name);
    const input = getInput(name);
    const credentials = getCredentials();
    const client = new StorageClient({ credentials });
    await delay(DELAYS.createTable);
    await client.addItem(input);
    const item = await getItem(name, 1);
    expect(item).toStrictEqual({ id: 1 });
  },
  DELAYS.longTest
);
