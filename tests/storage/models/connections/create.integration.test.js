import 'babel-polyfill';

import { v4 as uuid } from 'uuid';

import StorageClient from 'storage/client';
import { Connections } from 'storage/models';
import {
  createTable,
  delay,
  DELAYS,
  deleteTablesAfterDelay,
  getCredentials,
  getItem,
} from '../../utils';

const ISO_FORMAT = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
const TABLE_PREFIX = 'test-storage-models-connections-create';

afterAll(async () => {
  await deleteTablesAfterDelay(TABLE_PREFIX);
}, DELAYS.deleteTables);

test(
  'test create with existing table stores item',
  async () => {
    const environment = `${TABLE_PREFIX}-${uuid()}`;
    const name = `${environment}-connections`;
    const key = [
      {
        AttributeName: 'user',
        KeyType: 'HASH',
      },
      {
        AttributeName: 'token',
        KeyType: 'RANGE',
      },
    ];
    const attributes = [
      {
        AttributeName: 'user',
        AttributeType: 'S',
      },
      {
        AttributeName: 'token',
        AttributeType: 'S',
      },
    ];
    await createTable(name, key, attributes);
    const storageClient = new StorageClient({ credentials: getCredentials() });
    const connections = new Connections({
      environment,
      storageClient,
      user: 'user',
    });
    await delay(DELAYS.createTable);
    await connections.create({
      id: 'id',
      name: 'name',
      token: 'token',
    });
    const item = await getItem(name, null, null, {
      user: 'user',
      token: 'token',
    });
    expect(item.createdDate).toMatch(ISO_FORMAT);
    expect(item.id).toBe('id');
    expect(item.institution.name).toBe('name');
    expect(item.modifiedDate).toMatch(ISO_FORMAT);
    expect(item.token).toBe('token');
    expect(item.user).toBe('user');
    expect(item.createdDate).toBe(item.modifiedDate);
  },
  DELAYS.longTest
);

test(
  'test create with missing table creates table and stores item',
  async () => {
    const environment = `${TABLE_PREFIX}-${uuid()}`;
    const storageClient = new StorageClient({ credentials: getCredentials() });
    const connections = new Connections({
      environment,
      storageClient,
      user: 'user',
    });
    await connections.create({
      id: 'id',
      name: 'name',
      token: 'token',
    });
    const item = await getItem(`${environment}-connections`, null, null, {
      user: 'user',
      token: 'token',
    });
    expect(item.createdDate).toMatch(ISO_FORMAT);
    expect(item.id).toBe('id');
    expect(item.institution.name).toBe('name');
    expect(item.modifiedDate).toMatch(ISO_FORMAT);
    expect(item.token).toBe('token');
    expect(item.user).toBe('user');
    expect(item.createdDate).toBe(item.modifiedDate);
  },
  DELAYS.longTest
);
