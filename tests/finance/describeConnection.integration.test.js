import 'babel-polyfill';

import Client, { AuthenticationError } from 'finance';
import settings from 'settings';

test('test describe connection with bad id in constructor throws authentication error', async () => {
  const client = new Client({
    env: 'sandbox',
    id: 'bad',
    secret: settings.TRANSACTION_SECRET,
  });
  await expect(async () => {
    await client.describeConnection({ token: 'token' });
  }).rejects.toThrow(AuthenticationError);
});

test('test describe connection with bad secret in constructor throws authentication error', async () => {
  const client = new Client({
    env: 'sandbox',
    id: settings.TRANSACTION_ID,
    secret: 'bad',
  });
  await expect(async () => {
    await client.describeConnection({ token: 'token' });
  }).rejects.toThrow(AuthenticationError);
});
