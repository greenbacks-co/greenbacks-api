import 'babel-polyfill';

import { InputError } from 'errors';
import { Connections } from 'storage/models';

const ISO_FORMAT = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

class ClientStub {
  constructor({ shouldThrowError = false } = {}) {
    this.createdConnection = null;
    this.shouldThrowError = shouldThrowError;
  }

  async addItemAndCreateTable({ item, key, table }) {
    if (this.shouldThrowError) throw new Error();
    this.createdConnection = { item, key, table };
  }
}

const getConstructorInput = (storageClient) => ({
  environment: 'foo',
  storageClient,
  user: 'foo',
});

const getInput = () => ({
  id: 'id',
  name: 'name',
  token: 'token',
});

test('test create with environment foo calls create with table foo-connections', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  const connections = new Connections(constructorInput);
  await connections.create(input);
  expect(client.createdConnection.table).toBe('foo-connections');
});

test('test create with environment bar calls create with table bar-connections', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  constructorInput.environment = 'bar';
  const input = getInput();
  const connections = new Connections(constructorInput);
  await connections.create(input);
  expect(client.createdConnection.table).toBe('bar-connections');
});

test('test create with id foo calls create with id foo', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  input.id = 'foo';
  const connections = new Connections(constructorInput);
  await connections.create(input);
  expect(client.createdConnection.item.id).toBe('foo');
});

test('test create with id bar calls create with id bar', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  input.id = 'bar';
  const connections = new Connections(constructorInput);
  await connections.create(input);
  expect(client.createdConnection.item.id).toBe('bar');
});

test('test create without id throws input error', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  delete input.id;
  const connections = new Connections(constructorInput);
  await expect(async () => {
    await connections.create(input);
  }).rejects.toThrow(InputError);
});

test('test create with name foo calls create with name foo', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  input.name = 'foo';
  const connections = new Connections(constructorInput);
  await connections.create(input);
  expect(client.createdConnection.item.institution.name).toBe('foo');
});

test('test create with name bar calls create with name bar', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  input.name = 'bar';
  const connections = new Connections(constructorInput);
  await connections.create(input);
  expect(client.createdConnection.item.institution.name).toBe('bar');
});

test('test create without name throws input error', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  delete input.name;
  const connections = new Connections(constructorInput);
  await expect(async () => {
    await connections.create(input);
  }).rejects.toThrow(InputError);
});

test('test create with token foo calls create with token foo', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  input.token = 'foo';
  const connections = new Connections(constructorInput);
  await connections.create(input);
  expect(client.createdConnection.item.token).toBe('foo');
});

test('test create with token bar calls create with token bar', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  input.token = 'bar';
  const connections = new Connections(constructorInput);
  await connections.create(input);
  expect(client.createdConnection.item.token).toBe('bar');
});

test('test create without token throws input error', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  delete input.token;
  const connections = new Connections(constructorInput);
  await expect(async () => {
    await connections.create(input);
  }).rejects.toThrow(InputError);
});

test('test create with user foo calls create with user foo', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  constructorInput.user = 'foo';
  const input = getInput();
  const connections = new Connections(constructorInput);
  await connections.create(input);
  expect(client.createdConnection.item.user).toBe('foo');
});

test('test create with user bar calls create with user bar', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  constructorInput.user = 'bar';
  const input = getInput();
  const connections = new Connections(constructorInput);
  await connections.create(input);
  expect(client.createdConnection.item.user).toBe('bar');
});

test('test create with extra value foo calls create without extra value', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  input.foo = 'bar';
  const connections = new Connections(constructorInput);
  await connections.create(input);
  expect(client.createdConnection.item).not.toHaveProperty('foo');
});

test('test create has matching createdDate and modifiedDate', async () => {
  const client = new ClientStub();
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  const connections = new Connections(constructorInput);
  await connections.create(input);
  expect(client.createdConnection.item.createdDate).toMatch(ISO_FORMAT);
  expect(client.createdConnection.item.modifiedDate).toMatch(ISO_FORMAT);
  expect(client.createdConnection.item.createdDate).toBe(
    client.createdConnection.item.modifiedDate
  );
});

test('test create calls add item and create table with correct key', async () => {
  const client = new ClientStub({
    shouldThrowMissingTableError: true,
  });
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  const connections = new Connections(constructorInput);
  await connections.create(input);
  expect(client.createdConnection.key).toStrictEqual({
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

test('test create with error throws error', async () => {
  const client = new ClientStub({ shouldThrowError: true });
  const constructorInput = getConstructorInput(client);
  const input = getInput();
  const connections = new Connections(constructorInput);
  await expect(async () => {
    await connections.create(input);
  }).rejects.toThrow(Error);
});
