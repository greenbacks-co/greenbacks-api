import 'babel-polyfill';

import Client, { AuthenticationError } from 'finance';
import settings from 'settings';

test('test create connection initialization token with bad id in constructor throws authentication error', async () => {
  const client = new Client({
    id: 'bad',
    env: 'sandbox',
    secret: settings.TRANSACTION_SECRET,
  });
  await expect(async () => {
    await client.createConnectionInitializationToken({ id: 'id' });
  }).rejects.toThrow(AuthenticationError);
});

test('test create connection initialization token with bad secret in constructor throws authentication error', async () => {
  const client = new Client({
    id: settings.TRANSACTION_ID,
    env: 'sandbox',
    secret: 'bad',
  });
  await expect(async () => {
    await client.createConnectionInitializationToken({ id: 'id' });
  }).rejects.toThrow(AuthenticationError);
});

test('test create connection initialization token with correct constructor input does not throw', async () => {
  const client = new Client({
    id: settings.TRANSACTION_ID,
    env: 'sandbox',
    secret: settings.TRANSACTION_SECRET,
  });
  const token = await client.createConnectionInitializationToken({ id: 'id' });
  expect(token).toBeTruthy();
});
