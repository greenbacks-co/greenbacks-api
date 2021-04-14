import 'babel-polyfill';

import { InputError } from 'errors';
import StorageClient from 'storage/client';

class SdkStub {
  constructor({ result = [] } = {}) {
    this.result = result;
    this.call = null;
  }

  query(input, callback) {
    this.call = input;
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
  shouldReverse: false,
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

test('list items with should reverse true calls query with scan index forward false', async () => {
  const stub = new SdkStub();
  const credentials = getCredentials();
  const input = getInput();
  input.shouldReverse = true;
  const client = new StorageClient({
    ...credentials,
    client: stub,
  });
  await client.listItems(input);
  expect(stub.call.ScanIndexForward).toBe(false);
});

test('list items with should reverse false calls query with scan index forward true', async () => {
  const stub = new SdkStub();
  const credentials = getCredentials();
  const input = getInput();
  const client = new StorageClient({
    ...credentials,
    client: stub,
  });
  await client.listItems(input);
  expect(stub.call.ScanIndexForward).toBe(true);
});

test('list items without should reverse calls query with scan index forward true', async () => {
  const stub = new SdkStub();
  const credentials = getCredentials();
  const input = getInput();
  delete input.shouldReverse;
  const client = new StorageClient({
    ...credentials,
    client: stub,
  });
  await client.listItems(input);
  expect(stub.call.ScanIndexForward).toBe(true);
});

test('list items with limit calls query with limit', async () => {
  const stub = new SdkStub();
  const credentials = getCredentials();
  const input = getInput();
  input.limit = 1;
  const client = new StorageClient({
    ...credentials,
    client: stub,
  });
  await client.listItems(input);
  expect(stub.call.Limit).toBe(1);
});

test('list items without limit calls query without limit', async () => {
  const stub = new SdkStub();
  const credentials = getCredentials();
  const input = getInput();
  delete input.limit;
  const client = new StorageClient({
    ...credentials,
    client: stub,
  });
  await client.listItems(input);
  expect(stub.call).not.toHaveProperty('Limit');
});
