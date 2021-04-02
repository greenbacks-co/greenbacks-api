import 'babel-polyfill';

import { InputError } from 'errors';
import StorageClient from 'storage/client';

class SdkStub {
  constructor({ result = [] } = {}) {
    this.result = result;
  }

  query(input, callback) {
    callback(null, { Items: this.result });
  }
}

const getCredentials = () => ({
  credentials: {
    id: 'test-id',
    secret: 'test-secret',
  },
});

const getInput = () => ({
  key: {
    partition: { id: 1 },
  },
  table: 'test-table',
});

test('list items without table throws input error', async () => {
  const credentials = getCredentials();
  const input = getInput();
  delete input.table;
  const client = new StorageClient(credentials);
  await expect(async () => {
    await client.listItems(input);
  }).rejects.toThrow(InputError);
});

test('list items without key throws input error', async () => {
  const credentials = getCredentials();
  const input = getInput();
  delete input.key;
  const client = new StorageClient(credentials);
  await expect(async () => {
    await client.listItems(input);
  }).rejects.toThrow(InputError);
});

test('list items without partition in key throws input error', async () => {
  const credentials = getCredentials();
  const input = getInput();
  delete input.key.partition;
  const client = new StorageClient(credentials);
  await expect(async () => {
    await client.listItems(input);
  }).rejects.toThrow(InputError);
});

test('list items with bad partition in key throws input error', async () => {
  const credentials = getCredentials();
  const input = getInput();
  input.key.partition = 1;
  const client = new StorageClient(credentials);
  await expect(async () => {
    await client.listItems(input);
  }).rejects.toThrow(InputError);
});

test('list items with empty partition in key throws input error', async () => {
  const credentials = getCredentials();
  const input = getInput();
  input.key.partition = {};
  const client = new StorageClient(credentials);
  await expect(async () => {
    await client.listItems(input);
  }).rejects.toThrow(InputError);
});

test('list items with extra partition in key throws input error', async () => {
  const credentials = getCredentials();
  const input = getInput();
  input.key.partition = { id: 1, extra: 2 };
  const client = new StorageClient(credentials);
  await expect(async () => {
    await client.listItems(input);
  }).rejects.toThrow(InputError);
});

test('list items with correct input does not throw', async () => {
  const credentials = getCredentials();
  const input = getInput();
  const client = new StorageClient({
    ...credentials,
    client: new SdkStub(),
  });
  await client.listItems(input);
});

test('list items with nested string removes string identifier', async () => {
  const credentials = getCredentials();
  const input = getInput();
  const client = new StorageClient({
    ...credentials,
    client: new SdkStub({
      result: [{ id: 'test', nested: { test: { S: 'test' } } }],
    }),
  });
  const result = await client.listItems(input);
  expect(result).toStrictEqual([{ id: 'test', nested: { test: 'test' } }]);
});

test('list items with nested number removes number identifier', async () => {
  const credentials = getCredentials();
  const input = getInput();
  const client = new StorageClient({
    ...credentials,
    client: new SdkStub({
      result: [{ id: 'test', nested: { test: { N: 1 } } }],
    }),
  });
  const result = await client.listItems(input);
  expect(result).toStrictEqual([{ id: 'test', nested: { test: 1 } }]);
});

test('list items with nested boolean removes boolean identifier', async () => {
  const credentials = getCredentials();
  const input = getInput();
  const client = new StorageClient({
    ...credentials,
    client: new SdkStub({
      result: [{ id: 'test', nested: { test: { B: true } } }],
    }),
  });
  const result = await client.listItems(input);
  expect(result).toStrictEqual([{ id: 'test', nested: { test: true } }]);
});
