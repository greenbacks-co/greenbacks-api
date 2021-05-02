import 'babel-polyfill';

import { v4 as uuid } from 'uuid';

import StorageClient, { AuthenticationError } from 'storage/client';
import {
  createTable,
  delay,
  DELAYS,
  deleteTablesAfterDelay,
  getCredentials,
  getItem,
} from '../../utils';

const TABLE_PREFIX = 'test-add-items-authentication';

const getInput = (table) => ({
  items: [
    {
      id: 1,
    },
  ],
  table,
});

afterAll(async () => {
  await deleteTablesAfterDelay(TABLE_PREFIX);
}, DELAYS.deleteTables);

test(
  'add items without id in credentials throws input error',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    const credentials = getCredentials();
    const input = getInput(name);
    delete credentials.id;
    const client = new StorageClient({ credentials });
    expect(async () => {
      await client.addItems(input);
    }).rejects.toThrow(AuthenticationError);
  },
  DELAYS.longTest
);

test(
  'add items with empty id in credentials throws input error',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    const credentials = getCredentials();
    const input = getInput(name);
    credentials.id = '';
    const client = new StorageClient({ credentials });
    expect(async () => {
      await client.addItems(input);
    }).rejects.toThrow(AuthenticationError);
  },
  DELAYS.longTest
);

test(
  'add items without secret in credentials throws input error',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    const credentials = getCredentials();
    const input = getInput(name);
    delete credentials.secret;
    const client = new StorageClient({ credentials });
    expect(async () => {
      await client.addItems(input);
    }).rejects.toThrow(AuthenticationError);
  },
  DELAYS.longTest
);

test(
  'add items with empty secret in credentials throws input error',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    const credentials = getCredentials();
    const input = getInput(name);
    credentials.secret = '';
    const client = new StorageClient({ credentials });
    expect(async () => {
      await client.addItems(input);
    }).rejects.toThrow(AuthenticationError);
  },
  DELAYS.longTest
);

test(
  'add items with bad id in credentials throws authentication error',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    const credentials = getCredentials();
    const input = getInput(name);
    credentials.id = 'bad';
    const client = new StorageClient({ credentials });
    await createTable(name);
    expect(async () => {
      await client.addItems(input);
    }).rejects.toThrow(AuthenticationError);
  },
  DELAYS.longTest
);

test(
  'add items with bad secret in credentials throws authentication error',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    const credentials = getCredentials();
    const input = getInput(name);
    credentials.secret = 'bad';
    const client = new StorageClient({ credentials });
    await createTable(name);
    expect(async () => {
      await client.addItems(input);
    }).rejects.toThrow(AuthenticationError);
  },
  DELAYS.longTest
);

test(
  'add items with correct credentials is successful',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    const credentials = getCredentials();
    const client = new StorageClient({ credentials });
    const input = getInput(name);
    await createTable(name);
    await delay(DELAYS.createTable);
    await client.addItems(input);
    const item = await getItem(name, 1);
    expect(item).toStrictEqual({ id: 1 });
  },
  DELAYS.longTest
);
