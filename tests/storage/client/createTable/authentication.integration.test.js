import 'babel-polyfill';

import { v4 as uuid } from 'uuid';

import StorageClient, { AuthenticationError } from 'storage/client';
import { DELAYS, deleteTablesAfterDelay, getCredentials } from '../../utils';

const TABLE_PREFIX = 'test-create-table-authentication';

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

test('create table without id in credentials throws authentication error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const input = getInput(name);
  delete credentials.id;
  const client = new StorageClient({ credentials });
  expect(async () => {
    await client.createTable(input);
  }).rejects.toThrow(AuthenticationError);
});

test('create table without secret in credentials throws authentication error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const input = getInput(name);
  delete credentials.secret;
  const client = new StorageClient({ credentials });
  expect(async () => {
    await client.createTable(input);
  }).rejects.toThrow(AuthenticationError);
});

test('create table with bad id in credentials throws authentication error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const input = getInput(name);
  credentials.id = 'bad';
  const client = new StorageClient({ credentials });
  expect(async () => {
    await client.createTable(input);
  }).rejects.toThrow(AuthenticationError);
});

test('create table with bad secret in credentials throws authentication error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const input = getInput(name);
  credentials.secret = 'bad';
  const client = new StorageClient({ credentials });
  expect(async () => {
    await client.createTable(input);
  }).rejects.toThrow(AuthenticationError);
});

test('create table with correct credentials is successful', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const input = getInput(name);
  const client = new StorageClient({ credentials });
  await client.createTable(input);
});
