import 'babel-polyfill';

import Client from 'storage/client';
import { MissingTableError } from 'storage/client/errors';
import { InputError } from 'errors';

class ClientStub {
  constructor({ hasTable = false } = {}) {
    this.hasTable = hasTable;
    this.addItemsCalls = [];
    this.createTableCalls = [];
  }

  addItems(input) {
    this.addItemsCalls.push(input);
    if (!this.hasTable && this.addItemsCalls.length === 1)
      throw new MissingTableError(input.table);
  }

  createTable(input) {
    this.createTableCalls.push(input);
  }
}

const getClient = () =>
  new Client({ credentials: { id: 'test', secret: 'test' } });

const getInput = () => ({
  items: [{ id: 'test' }],
  key: { partition: { name: 'test', type: 'string' } },
  table: 'test',
});

test('test without items throws input error', async () => {
  const client = getClient();
  const input = getInput();
  delete input.items;
  await expect(async () => {
    await client.addItemsAndCreateTable(input);
  }).rejects.toThrow(InputError);
});

test('test without key throws input error', async () => {
  const client = getClient();
  const input = getInput();
  delete input.key;
  await expect(async () => {
    await client.addItemsAndCreateTable(input);
  }).rejects.toThrow(InputError);
});

test('test without table throws input error', async () => {
  const client = getClient();
  const input = getInput();
  delete input.table;
  await expect(async () => {
    await client.addItemsAndCreateTable(input);
  }).rejects.toThrow(InputError);
});

test('test with existing table is successful', async () => {
  const stub = new ClientStub({ hasTable: true });
  const client = getClient();
  client.addItems = (input) => {
    stub.addItems(input);
  };
  client.createTable = (input) => {
    stub.createTable(input);
  };
  const input = getInput();
  await client.addItemsAndCreateTable(input);
  expect(stub.addItemsCalls).toStrictEqual([
    { items: [{ id: 'test' }], table: 'test' },
  ]);
  expect(stub.createTableCalls).toStrictEqual([]);
});

test('test with missing table creates table and retries', async () => {
  const stub = new ClientStub();
  const client = getClient();
  client.addItems = (input) => {
    stub.addItems(input);
  };
  client.createTable = (input) => {
    stub.createTable(input);
  };
  const input = getInput();
  await client.addItemsAndCreateTable(input);
  expect(stub.addItemsCalls).toStrictEqual([
    { items: [{ id: 'test' }], table: 'test' },
    { items: [{ id: 'test' }], table: 'test' },
  ]);
  expect(stub.createTableCalls).toStrictEqual([
    { key: { partition: { name: 'test', type: 'string' } }, name: 'test' },
  ]);
});
