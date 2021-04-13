import 'babel-polyfill';

import Client from 'storage/client';
import { MissingTableError } from 'storage/client/errors';
import { InputError } from 'errors';

class ClientStub {
  constructor({ hasTable = false } = {}) {
    this.hasTable = hasTable;
    this.addItemCalls = [];
    this.createTableCalls = [];
  }

  addItem(input) {
    this.addItemCalls.push(input);
    if (!this.hasTable && this.addItemCalls.length === 1)
      throw new MissingTableError(input.table);
  }

  createTable(input) {
    this.createTableCalls.push(input);
  }
}

const getClient = () =>
  new Client({ credentials: { id: 'test', secret: 'test' } });

const getInput = () => ({
  item: { id: 'test' },
  key: { partition: { name: 'test', type: 'string' } },
  table: 'test',
});

test('test without item throws input error', async () => {
  const client = getClient();
  const input = getInput();
  delete input.item;
  await expect(async () => {
    await client.addItemAndCreateTable(input);
  }).rejects.toThrow(InputError);
});

test('test without key throws input error', async () => {
  const client = getClient();
  const input = getInput();
  delete input.key;
  await expect(async () => {
    await client.addItemAndCreateTable(input);
  }).rejects.toThrow(InputError);
});

test('test without table throws input error', async () => {
  const client = getClient();
  const input = getInput();
  delete input.table;
  await expect(async () => {
    await client.addItemAndCreateTable(input);
  }).rejects.toThrow(InputError);
});

test('test with existing table is successful', async () => {
  const stub = new ClientStub({ hasTable: true });
  const client = getClient();
  client.addItem = (input) => {
    stub.addItem(input);
  };
  client.createTable = (input) => {
    stub.createTable(input);
  };
  const input = getInput();
  await client.addItemAndCreateTable(input);
  expect(stub.addItemCalls).toStrictEqual([
    { item: { id: 'test' }, table: 'test' },
  ]);
  expect(stub.createTableCalls).toStrictEqual([]);
});

test('test with missing table creates table and retries', async () => {
  const stub = new ClientStub();
  const client = getClient();
  client.addItem = (input) => {
    stub.addItem(input);
  };
  client.createTable = (input) => {
    stub.createTable(input);
  };
  const input = getInput();
  await client.addItemAndCreateTable(input);
  expect(stub.addItemCalls).toStrictEqual([
    { item: { id: 'test' }, table: 'test' },
    { item: { id: 'test' }, table: 'test' },
  ]);
  expect(stub.createTableCalls).toStrictEqual([
    { key: { partition: { name: 'test', type: 'string' } }, name: 'test' },
  ]);
});
