import 'babel-polyfill';

import { Connections } from 'storage/models';
import { MissingTableError } from 'storage/client';

class ClientStub {
  constructor({
    result = [],
    shouldThrowError = false,
    shouldThrowMissingTableError = false,
  } = {}) {
    this.arguments = {};
    this.result = result;
    this.shouldThrowError = shouldThrowError;
    this.shouldThrowMissingTableError = shouldThrowMissingTableError;
  }

  listItems({ key, table }) {
    if (this.shouldThrowError) throw new Error();
    if (this.shouldThrowMissingTableError) throw new MissingTableError(table);
    this.arguments = { key, table };
    return this.result;
  }
}

test('test list with environment foo calls list with table foo-connections', async () => {
  const storageClient = new ClientStub();
  const connections = new Connections({
    environment: 'foo',
    storageClient,
    user: 'foo',
  });
  await connections.list();
  expect(storageClient.arguments.table).toBe('foo-connections');
});

test('test list with environment bar calls list with table bar-connections', async () => {
  const storageClient = new ClientStub();
  const connections = new Connections({
    environment: 'bar',
    storageClient,
    user: 'foo',
  });
  await connections.list();
  expect(storageClient.arguments.table).toBe('bar-connections');
});

test('test list with user foo calls list with user foo', async () => {
  const storageClient = new ClientStub();
  const connections = new Connections({
    environment: 'foo',
    storageClient,
    user: 'foo',
  });
  await connections.list();
  expect(storageClient.arguments.key.partition).toStrictEqual({ user: 'foo' });
});

test('test list with user bar calls list with user bar', async () => {
  const storageClient = new ClientStub();
  const connections = new Connections({
    environment: 'foo',
    storageClient,
    user: 'bar',
  });
  await connections.list();
  expect(storageClient.arguments.key.partition).toStrictEqual({ user: 'bar' });
});

test('test list with missing table returns empty list', async () => {
  const storageClient = new ClientStub({ shouldThrowMissingTableError: true });
  const connections = new Connections({
    environment: 'foo',
    storageClient,
    user: 'foo',
  });
  const list = await connections.list();
  expect(list).toStrictEqual([]);
});

test('test list with error throws error', async () => {
  const storageClient = new ClientStub({ shouldThrowError: true });
  const connections = new Connections({
    environment: 'foo',
    storageClient,
    user: 'foo',
  });
  await expect(async () => {
    await connections.list();
  }).rejects.toThrow();
});

test('test list returns list from storage client', async () => {
  const storageClient = new ClientStub({ result: [{ test: 'test' }] });
  const connections = new Connections({
    environment: 'foo',
    storageClient,
    user: 'foo',
  });
  const list = await connections.list();
  expect(list).toStrictEqual([{ test: 'test' }]);
});
