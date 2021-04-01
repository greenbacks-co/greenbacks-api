import 'babel-polyfill';

import { InputError } from 'errors';
import { Connections } from 'storage/models';
import { MissingTableError } from 'storage/client';

const ISO_FORMAT = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

class StorageClientStub {
  constructor({
    shouldThrowError = false,
    shouldThrowMissingTableError = false,
  } = {}) {
    this.addItemCalls = 0;
    this.createdConnection = {};
    this.createdTable = {};
    this.shouldThrowError = shouldThrowError;
    this.shouldThrowMissingTableError = shouldThrowMissingTableError;
  }

  async addItem({ item, table }) {
    this.addItemCalls += 1;
    if (this.shouldThrowMissingTableError && this.addItemCalls === 1)
      throw new MissingTableError(table);
    if (this.shouldThrowError) throw new Error();
    this.createdConnection = { item, table };
  }

  async createTable({ key, name }) {
    this.createdTable = { key, name };
  }
}

const getInput = () => ({
  id: 'id',
  name: 'name',
  token: 'token',
  user: 'user',
});

test('test create with environment foo calls create with table foo-connections', async () => {
  const storageClient = new StorageClientStub();
  const connections = new Connections({ environment: 'foo', storageClient });
  const input = getInput();
  await connections.create(input);
  expect(storageClient.createdConnection.table).toBe('foo-connections');
});

test('test create with environment bar calls create with table bar-connections', async () => {
  const storageClient = new StorageClientStub();
  const connections = new Connections({ environment: 'bar', storageClient });
  const input = getInput();
  await connections.create(input);
  expect(storageClient.createdConnection.table).toBe('bar-connections');
});

test('test create with id foo calls create with id foo', async () => {
  const storageClient = new StorageClientStub();
  const connections = new Connections({ environment: 'bar', storageClient });
  const input = getInput();
  input.id = 'foo';
  await connections.create(input);
  expect(storageClient.createdConnection.item.id).toBe('foo');
});

test('test create with id bar calls create with id bar', async () => {
  const storageClient = new StorageClientStub();
  const connections = new Connections({ environment: 'bar', storageClient });
  const input = getInput();
  input.id = 'bar';
  await connections.create(input);
  expect(storageClient.createdConnection.item.id).toBe('bar');
});

test('test create without id throws input error', async () => {
  const storageClient = new StorageClientStub();
  const connections = new Connections({ environment: 'foo', storageClient });
  const input = getInput();
  delete input.id;
  await expect(async () => {
    await connections.create(input);
  }).rejects.toThrow(InputError);
});

test('test create with name foo calls create with name foo', async () => {
  const storageClient = new StorageClientStub();
  const connections = new Connections({ environment: 'bar', storageClient });
  const input = getInput();
  input.name = 'foo';
  await connections.create(input);
  expect(storageClient.createdConnection.item.name).toBe('foo');
});

test('test create with name bar calls create with name bar', async () => {
  const storageClient = new StorageClientStub();
  const connections = new Connections({ environment: 'bar', storageClient });
  const input = getInput();
  input.name = 'bar';
  await connections.create(input);
  expect(storageClient.createdConnection.item.name).toBe('bar');
});

test('test create without name throws input error', async () => {
  const storageClient = new StorageClientStub();
  const connections = new Connections({ environment: 'foo', storageClient });
  const input = getInput();
  delete input.name;
  await expect(async () => {
    await connections.create(input);
  }).rejects.toThrow(InputError);
});

test('test create with token foo calls create with token foo', async () => {
  const storageClient = new StorageClientStub();
  const connections = new Connections({ environment: 'bar', storageClient });
  const input = getInput();
  input.token = 'foo';
  await connections.create(input);
  expect(storageClient.createdConnection.item.token).toBe('foo');
});

test('test create with token bar calls create with token bar', async () => {
  const storageClient = new StorageClientStub();
  const connections = new Connections({ environment: 'bar', storageClient });
  const input = getInput();
  input.token = 'bar';
  await connections.create(input);
  expect(storageClient.createdConnection.item.token).toBe('bar');
});

test('test create without token throws input error', async () => {
  const storageClient = new StorageClientStub();
  const connections = new Connections({ environment: 'foo', storageClient });
  const input = getInput();
  delete input.token;
  await expect(async () => {
    await connections.create(input);
  }).rejects.toThrow(InputError);
});

test('test create with user foo calls create with user foo', async () => {
  const storageClient = new StorageClientStub();
  const connections = new Connections({ environment: 'bar', storageClient });
  const input = getInput();
  input.user = 'foo';
  await connections.create(input);
  expect(storageClient.createdConnection.item.user).toBe('foo');
});

test('test create with user bar calls create with user bar', async () => {
  const storageClient = new StorageClientStub();
  const connections = new Connections({ environment: 'bar', storageClient });
  const input = getInput();
  input.user = 'bar';
  await connections.create(input);
  expect(storageClient.createdConnection.item.user).toBe('bar');
});

test('test create without user throws input error', async () => {
  const storageClient = new StorageClientStub();
  const connections = new Connections({ environment: 'foo', storageClient });
  const input = getInput();
  delete input.user;
  await expect(async () => {
    await connections.create(input);
  }).rejects.toThrow(InputError);
});

test('test create with extra value foo calls create without extra value', async () => {
  const storageClient = new StorageClientStub();
  const connections = new Connections({ environment: 'bar', storageClient });
  const input = getInput();
  input.foo = 'bar';
  await connections.create(input);
  expect(storageClient.createdConnection.item).not.toHaveProperty('foo');
});

test('test create has matching createdDate and modifiedDate', async () => {
  const storageClient = new StorageClientStub();
  const connections = new Connections({ environment: 'bar', storageClient });
  const input = getInput();
  await connections.create(input);
  expect(storageClient.createdConnection.item.createdDate).toMatch(ISO_FORMAT);
  expect(storageClient.createdConnection.item.modifiedDate).toMatch(ISO_FORMAT);
  expect(storageClient.createdConnection.item.createdDate).toBe(
    storageClient.createdConnection.item.modifiedDate
  );
});

test('test create with environment foo and missing table creates table foo-connections', async () => {
  const storageClient = new StorageClientStub({
    shouldThrowMissingTableError: true,
  });
  const connections = new Connections({ environment: 'foo', storageClient });
  const input = getInput();
  await connections.create(input);
  expect(storageClient.createdTable.name).toBe('foo-connections');
});

test('test create with environment bar and missing table creates table foo-connections', async () => {
  const storageClient = new StorageClientStub({
    shouldThrowMissingTableError: true,
  });
  const connections = new Connections({ environment: 'bar', storageClient });
  const input = getInput();
  await connections.create(input);
  expect(storageClient.createdTable.name).toBe('bar-connections');
});

test('test create with missing table creates table with correct key', async () => {
  const storageClient = new StorageClientStub({
    shouldThrowMissingTableError: true,
  });
  const connections = new Connections({ environment: 'bar', storageClient });
  const input = getInput();
  await connections.create(input);
  expect(storageClient.createdTable.key).toStrictEqual({
    partition: {
      name: 'user',
      type: 'string',
    },
    sort: {
      name: 'token',
      type: 'string',
    },
  });
});

test('test create with missing table error calls create account twice', async () => {
  const storageClient = new StorageClientStub({
    shouldThrowMissingTableError: true,
  });
  const connections = new Connections({ environment: 'bar', storageClient });
  const input = getInput();
  await connections.create(input);
  expect(storageClient.addItemCalls).toBe(2);
});

test('test create with error throws error', async () => {
  const storageClient = new StorageClientStub({ shouldThrowError: true });
  const connections = new Connections({ environment: 'bar', storageClient });
  const input = getInput();
  await expect(async () => {
    await connections.create(input);
  }).rejects.toThrow(Error);
});
