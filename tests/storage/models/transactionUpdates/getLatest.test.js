import 'babel-polyfill';

import { MissingTableError } from 'storage/client/errors';
import Updates from 'storage/models/transactionUpdates';

class ClientStub {
  constructor({
    shouldThrow = false,
    shouldThrowMissingTableError = false,
  } = {}) {
    this.call = null;
    this.shouldThrow = shouldThrow;
    this.shouldThrowMissingTableError = shouldThrowMissingTableError;
  }

  async listItems(input) {
    this.call = input;
    return new Promise((resolve, reject) => {
      if (this.shouldThrow) reject(new Error());
      if (this.shouldThrowMissingTableError)
        reject(new MissingTableError('test'));
      resolve();
    });
  }
}

const getInput = (storageClient) => ({
  environment: 'foo',
  storageClient,
  user: 'foo',
});

test('get latest update with environment foo calls list items with table foo-transaction-updates', async () => {
  const stub = new ClientStub();
  const input = getInput(stub);
  const updates = new Updates(input);
  await updates.getLatest();
  expect(stub.call.table).toBe('foo-transaction-updates');
});

test('get latest update with environment bar calls list items with table bar-transaction-updates', async () => {
  const stub = new ClientStub();
  const input = getInput(stub);
  input.environment = 'bar';
  const updates = new Updates(input);
  await updates.getLatest();
  expect(stub.call.table).toBe('bar-transaction-updates');
});

test('get latest update with user foo calls list items with partition user foo', async () => {
  const stub = new ClientStub();
  const input = getInput(stub);
  const updates = new Updates(input);
  await updates.getLatest();
  expect(stub.call.key.partition.user).toBe('foo');
});

test('get latest update with user bar calls list items with partition user bar', async () => {
  const stub = new ClientStub();
  const input = getInput(stub);
  input.user = 'bar';
  const updates = new Updates(input);
  await updates.getLatest();
  expect(stub.call.key.partition.user).toBe('bar');
});

test('get latest update calls list items with limit 1', async () => {
  const stub = new ClientStub();
  const input = getInput(stub);
  const updates = new Updates(input);
  await updates.getLatest();
  expect(stub.call.limit).toBe(1);
});

test('get latest update calls list items with should reverse true', async () => {
  const stub = new ClientStub();
  const input = getInput(stub);
  const updates = new Updates(input);
  await updates.getLatest();
  expect(stub.call.shouldReverse).toBe(true);
});

test('get latest update with missing table returns null', async () => {
  const stub = new ClientStub({ shouldThrowMissingTableError: true });
  const input = getInput(stub);
  const updates = new Updates(input);
  const result = await updates.getLatest();
  expect(result).toBe(null);
});

test('get latest update with error throws error', async () => {
  const stub = new ClientStub({ shouldThrow: true });
  const input = getInput(stub);
  const updates = new Updates(input);
  await expect(async () => {
    await updates.getLatest();
  }).rejects.toThrow(Error);
});
