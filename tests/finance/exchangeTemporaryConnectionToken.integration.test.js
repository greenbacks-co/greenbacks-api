import 'babel-polyfill';

import Client, { AuthenticationError, TokenError } from 'finance';
import settings from 'settings';

test('test exchange temporary connection token with bad id in constructor throws authentication error', async () => {
  const client = new Client({
    env: 'sandbox',
    id: 'bad',
    secret: settings.TRANSACTION_SECRET,
  });
  await expect(async () => {
    await client.exchangeTemporaryConnectionToken({ token: 'token' });
  }).rejects.toThrow(AuthenticationError);
});

test('test exchange temporary connection token with bad secret in constructor throws authentication error', async () => {
  const client = new Client({
    env: 'sandbox',
    id: settings.TRANSACTION_ID,
    secret: 'bad',
  });
  await expect(async () => {
    await client.exchangeTemporaryConnectionToken({ token: 'token' });
  }).rejects.toThrow(AuthenticationError);
});

test('test exchange temporary connection token with bad token throws token error', async () => {
  const client = new Client({
    env: 'sandbox',
    id: settings.TRANSACTION_ID,
    secret: settings.TRANSACTION_SECRET,
  });
  await expect(async () => {
    await client.exchangeTemporaryConnectionToken({ token: 'token' });
  }).rejects.toThrow(TokenError);
});
