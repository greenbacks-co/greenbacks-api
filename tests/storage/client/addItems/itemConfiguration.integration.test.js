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

const TABLE_PREFIX = 'test-add-items-item-configuration';

const getInput = (table) => ({
  items: [
    {
      id: 1,
    },
  ],
  table,
});

afterAll(async () => {
  await deleteTablesAfterDelay(TABLE_PREFIX);
}, DELAYS.deleteTables);

test('add items without items throws input error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const input = getInput(name);
  const credentials = getCredentials();
  const client = new StorageClient({ credentials });
  delete input.items;
  expect(async () => {
    await client.addItems(input);
  }).rejects.toThrow(InputError);
});

test('add items with empty items throws input error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const input = getInput(name);
  const credentials = getCredentials();
  const client = new StorageClient({ credentials });
  input.items = [];
  expect(async () => {
    await client.addItems(input);
  }).rejects.toThrow(InputError);
});

test('add items with empty item in items throws input error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const input = getInput(name);
  const credentials = getCredentials();
  const client = new StorageClient({ credentials });
  input.items = [{}];
  expect(async () => {
    await client.addItems(input);
  }).rejects.toThrow(InputError);
});

test(
  'add items with string value is successful',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    await createTable(name);
    const input = getInput(name);
    const credentials = getCredentials();
    const client = new StorageClient({ credentials });
    input.items = [{ id: 1, test: 'test' }];
    await delay(DELAYS.createTable);
    await client.addItems(input);
    const item = await getItem(name, 1);
    expect(item.test).toBe('test');
  },
  DELAYS.longTest
);

test(
  'add items with numeric value is successful',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    await createTable(name);
    const input = getInput(name);
    const credentials = getCredentials();
    const client = new StorageClient({ credentials });
    input.items = [{ id: 1, test: 1 }];
    await delay(DELAYS.createTable);
    await client.addItems(input);
    const item = await getItem(name, 1);
    expect(item.test).toBe(1);
  },
  DELAYS.longTest
);

test(
  'add items with boolean value is successful',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    await createTable(name);
    const input = getInput(name);
    const credentials = getCredentials();
    const client = new StorageClient({ credentials });
    input.items = [{ id: 1, test: true }];
    await delay(DELAYS.createTable);
    await client.addItems(input);
    const item = await getItem(name, 1);
    expect(item.test).toBe(true);
  },
  DELAYS.longTest
);

test(
  'add items with object value is successful',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    await createTable(name);
    const input = getInput(name);
    const credentials = getCredentials();
    const client = new StorageClient({ credentials });
    input.items = [{ id: 1, test: { test: 'test' } }];
    await delay(DELAYS.createTable);
    await client.addItems(input);
    const item = await getItem(name, 1);
    expect(item.test).toStrictEqual({ test: 'test' });
  },
  DELAYS.longTest
);

test(
  'add items with list value is successful',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    await createTable(name);
    const input = getInput(name);
    const credentials = getCredentials();
    const client = new StorageClient({ credentials });
    input.items = [{ id: 1, test: [1] }];
    await delay(DELAYS.createTable);
    await client.addItems(input);
    const item = await getItem(name, 1);
    expect(item.test).toStrictEqual([1]);
  },
  DELAYS.longTest
);
