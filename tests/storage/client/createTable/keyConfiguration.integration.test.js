import 'babel-polyfill';

import { v4 as uuid } from 'uuid';

import StorageClient from 'storage/client';
import {
  DELAYS,
  deleteTablesAfterDelay,
  describeTable,
  getCredentials,
} from '../../utils';

const TABLE_PREFIX = 'test-create-table-key-configuration';

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

test('create table with string partition is successful', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const input = getInput(name);
  const client = new StorageClient({ credentials });
  input.key.partition.type = 'string';
  await client.createTable(input);
  const details = await describeTable(name);
  const partition = details.Table.AttributeDefinitions.find(
    (field) => field.AttributeName === 'id'
  );
  expect(partition.AttributeType).toBe('S');
});

test('create table with number partition is successful', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const input = getInput(name);
  const client = new StorageClient({ credentials });
  input.key.partition.type = 'number';
  await client.createTable(input);
  const details = await describeTable(name);
  const partition = details.Table.AttributeDefinitions.find(
    (field) => field.AttributeName === 'id'
  );
  expect(partition.AttributeType).toBe('N');
});

test('create table with boolean partition is successful', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const input = getInput(name);
  const client = new StorageClient({ credentials });
  input.key.partition.type = 'boolean';
  await client.createTable(input);
  const details = await describeTable(name);
  const partition = details.Table.AttributeDefinitions.find(
    (field) => field.AttributeName === 'id'
  );
  expect(partition.AttributeType).toBe('B');
});

test('create table with string sort is successful', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const input = getInput(name);
  const client = new StorageClient({ credentials });
  input.key.sort = {
    name: 'date',
    type: 'string',
  };
  await client.createTable(input);
  const details = await describeTable(name);
  const sort = details.Table.AttributeDefinitions.find(
    (field) => field.AttributeName === 'date'
  );
  expect(sort.AttributeType).toBe('S');
});

test('create table with number sort is successful', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const input = getInput(name);
  const client = new StorageClient({ credentials });
  input.key.sort = {
    name: 'date',
    type: 'number',
  };
  await client.createTable(input);
  const details = await describeTable(name);
  const sort = details.Table.AttributeDefinitions.find(
    (field) => field.AttributeName === 'date'
  );
  expect(sort.AttributeType).toBe('N');
});

test('create table with boolean sort is successful', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const input = getInput(name);
  const client = new StorageClient({ credentials });
  input.key.sort = {
    name: 'date',
    type: 'boolean',
  };
  await client.createTable(input);
  const details = await describeTable(name);
  const sort = details.Table.AttributeDefinitions.find(
    (field) => field.AttributeName === 'date'
  );
  expect(sort.AttributeType).toBe('B');
});
