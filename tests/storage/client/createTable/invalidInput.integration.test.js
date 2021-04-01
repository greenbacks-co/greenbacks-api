import 'babel-polyfill';

import { v4 as uuid } from 'uuid';

import { InputError } from 'errors';
import StorageClient from 'storage/client';
import { DELAYS, deleteTablesAfterDelay, getCredentials } from '../../utils';

const TABLE_PREFIX = 'test-create-table-invalid-input';

const getInput = (name) => ({
  key: {
    partition: {
      name: 'id',
      type: 'string',
    },
  },
  name,
});

afterAll(async () => {
  await deleteTablesAfterDelay(TABLE_PREFIX);
}, DELAYS.deleteTables);

test('create table without key throws input error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const input = getInput(name);
  const client = new StorageClient({ credentials });
  delete input.key;
  await expect(async () => {
    await client.createTable(input);
  }).rejects.toThrow(InputError);
});

test('create table without partition in key throws input error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const input = getInput(name);
  const client = new StorageClient({ credentials });
  delete input.key.partition;
  await expect(async () => {
    await client.createTable(input);
  }).rejects.toThrow(InputError);
});

test('create table without name in partition in key throws input error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const input = getInput(name);
  const client = new StorageClient({ credentials });
  delete input.key.partition.name;
  await expect(async () => {
    await client.createTable(input);
  }).rejects.toThrow(InputError);
});

test('create table without type in partition in key throws input error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const input = getInput(name);
  const client = new StorageClient({ credentials });
  delete input.key.partition.type;
  await expect(async () => {
    await client.createTable(input);
  }).rejects.toThrow(InputError);
});

test('create table with bad type in partition in key throws input error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const input = getInput(name);
  const client = new StorageClient({ credentials });
  input.key.partition.type = 'bad';
  await expect(async () => {
    await client.createTable(input);
  }).rejects.toThrow(InputError);
});

test('create table without name in sort in key throws input error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const input = getInput(name);
  const client = new StorageClient({ credentials });
  input.key.sort = {
    type: 'string',
  };
  await expect(async () => {
    await client.createTable(input);
  }).rejects.toThrow(InputError);
});

test('create table without type in sort in key throws input error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const input = getInput(name);
  const client = new StorageClient({ credentials });
  input.key.sort = {
    name: 'date',
  };
  await expect(async () => {
    await client.createTable(input);
  }).rejects.toThrow(InputError);
});

test('create table with bad type in sort in key throws input error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const input = getInput(name);
  const client = new StorageClient({ credentials });
  input.key.sort = {
    name: 'date',
    type: 'bad',
  };
  await expect(async () => {
    await client.createTable(input);
  }).rejects.toThrow(InputError);
});

test('create table without name throws input error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const input = getInput(name);
  const client = new StorageClient({ credentials });
  delete input.name;
  await expect(async () => {
    await client.createTable(input);
  }).rejects.toThrow(InputError);
});
