import 'babel-polyfill';

import { InputError } from 'errors';
import TransactionUpdates from 'storage/models/transactionUpdates';
import { ISO_FORMAT } from '../../utils';

class ClientStub {
  constructor() {
    this.call = {};
  }

  async addItemAndCreateTable({ item, key, table }) {
    this.call = { item, key, table };
  }
}

const getConstructorInput = (storageClient) => ({
  environment: 'foo',
  storageClient,
  user: 'foo',
});

const getInput = () => ({
  connections: ['foo'],
});

test('test create with environment foo calls create with table foo-transaction-updates', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  const updates = new TransactionUpdates(constructorInput);
  await updates.create(input);
  expect(client.call.table).toBe('foo-transaction-updates');
});

test('test create with environment bar calls create with table bar-transaction-updates', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  constructorInput.environment = 'bar';
  const updates = new TransactionUpdates(constructorInput);
  await updates.create(input);
  expect(client.call.table).toBe('bar-transaction-updates');
});

test('test create with user foo calls create with user foo', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  const updates = new TransactionUpdates(constructorInput);
  await updates.create(input);
  expect(client.call.item.user).toBe('foo');
});

test('test create with user bar calls create with user bar', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  constructorInput.user = 'bar';
  const updates = new TransactionUpdates(constructorInput);
  await updates.create(input);
  expect(client.call.item.user).toBe('bar');
});

test('test create with connections foo calls create with connections foo', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  const updates = new TransactionUpdates(constructorInput);
  await updates.create(input);
  expect(client.call.item.connections).toStrictEqual(['foo']);
});

test('test create with connections bar calls create with connections bar', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  input.connections = ['bar'];
  const updates = new TransactionUpdates(constructorInput);
  await updates.create(input);
  expect(client.call.item.connections).toStrictEqual(['bar']);
});

test('test create with connections foo and bar calls create with connections foo and bar', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  input.connections = ['foo', 'bar'];
  const updates = new TransactionUpdates(constructorInput);
  await updates.create(input);
  expect(client.call.item.connections).toStrictEqual(['foo', 'bar']);
});

test('test create without connections throws input error', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  delete input.connections;
  const updates = new TransactionUpdates(constructorInput);
  await expect(async () => {
    await updates.create(input);
  }).rejects.toThrow(InputError);
});

test('test create with extra value foo calls create without extra value', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  input.foo = 'bar';
  const updates = new TransactionUpdates(constructorInput);
  await updates.create(input);
  expect(client.call.item).not.toHaveProperty('foo');
});

test('test create has matching createdDate and modifiedDate', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  const updates = new TransactionUpdates(constructorInput);
  await updates.create(input);
  expect(client.call.item.createdDate).toMatch(ISO_FORMAT);
  expect(client.call.item.modifiedDate).toMatch(ISO_FORMAT);
  expect(client.call.item.createdDate).toBe(client.call.item.modifiedDate);
});

test('test create has empty finishedDate', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  const updates = new TransactionUpdates(constructorInput);
  await updates.create(input);
  expect(client.call.item).toHaveProperty('finishedDate');
  expect(client.call.item.finishedDate).toBe(null);
});

test('test create has empty error', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  const updates = new TransactionUpdates(constructorInput);
  await updates.create(input);
  expect(client.call.item).toHaveProperty('error');
  expect(client.call.item.error).toBe(null);
});

test('test create calls create with correct key', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  const updates = new TransactionUpdates(constructorInput);
  await updates.create(input);
  expect(client.call.key).toStrictEqual({
    partition: {
      name: 'user',
      type: 'string',
    },
    sort: {
      name: 'createdDate',
      type: 'string',
    },
  });
});
