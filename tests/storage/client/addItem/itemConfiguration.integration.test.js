import 'babel-polyfill';

import { v4 as uuid } from 'uuid';

import { InputError } from 'errors';
import StorageClient from 'storage/client';
import {
  createTable,
  delay,
  DELAYS,
  deleteTablesAfterDelay,
  getCredentials,
  getItem,
} from '../../utils';

const TABLE_PREFIX = 'test-add-item-item-configuration';

const getInput = (table) => ({
  item: {
    id: 1,
  },
  table,
});

afterAll(async () => {
  await deleteTablesAfterDelay(TABLE_PREFIX);
}, DELAYS.deleteTables);

test('add item without item throws input error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const input = getInput(name);
  const credentials = getCredentials();
  const client = new StorageClient({ credentials });
  delete input.item;
  expect(async () => {
    await client.addItem(input);
  }).rejects.toThrow(InputError);
});

test('add item with empty item throws input error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const input = getInput(name);
  const credentials = getCredentials();
  const client = new StorageClient({ credentials });
  input.item = {};
  expect(async () => {
    await client.addItem(input);
  }).rejects.toThrow(InputError);
});

test(
  'add item with string value is successful',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    await createTable(name);
    const input = getInput(name);
    const credentials = getCredentials();
    const client = new StorageClient({ credentials });
    input.item = { id: 1, test: 'test' };
    await delay(DELAYS.createTable);
    await client.addItem(input);
    const item = await getItem(name, 1);
    expect(item.test).toBe('test');
  },
  DELAYS.longTest
);

test(
  'add item with numeric value is successful',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    await createTable(name);
    const input = getInput(name);
    const credentials = getCredentials();
    const client = new StorageClient({ credentials });
    input.item = { id: 1, test: 1 };
    await delay(DELAYS.createTable);
    await client.addItem(input);
    const item = await getItem(name, 1);
    expect(item.test).toBe(1);
  },
  DELAYS.longTest
);

test(
  'add item with boolean value is successful',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    await createTable(name);
    const input = getInput(name);
    const credentials = getCredentials();
    const client = new StorageClient({ credentials });
    input.item = { id: 1, test: true };
    await delay(DELAYS.createTable);
    await client.addItem(input);
    const item = await getItem(name, 1);
    expect(item.test).toBe(true);
  },
  DELAYS.longTest
);

test(
  'add item with object value is successful',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    await createTable(name);
    const input = getInput(name);
    const credentials = getCredentials();
    const client = new StorageClient({ credentials });
    input.item = { id: 1, test: { test: 'test' } };
    await delay(DELAYS.createTable);
    await client.addItem(input);
    const item = await getItem(name, 1);
    expect(item.test).toStrictEqual({ test: 'test' });
  },
  DELAYS.longTest
);

test(
  'add item with list value is successful',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    await createTable(name);
    const input = getInput(name);
    const credentials = getCredentials();
    const client = new StorageClient({ credentials });
    input.item = { id: 1, test: [1] };
    await delay(DELAYS.createTable);
    await client.addItem(input);
    const item = await getItem(name, 1);
    expect(item.test).toStrictEqual([1]);
  },
  DELAYS.longTest
);
