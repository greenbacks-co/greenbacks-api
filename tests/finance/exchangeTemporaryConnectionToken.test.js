import 'babel-polyfill';

import { InputError } from 'errors';
import Client from 'finance';
import settings from 'settings';

const getClient = () =>
  new Client({
    env: 'sandbox',
    id: settings.TRANSACTION_ID,
    secret: settings.TRANSACTION_SECRET,
  });

class PlaidClientStub {
  async exchangePublicToken(_input) {
    return new Promise((resolve) => {
      resolve({ access_token: 'token' });
    });
  }
}

test('test exchange temporary connection token without token throws input error', async () => {
  const stub = new PlaidClientStub();
  const client = getClient();
  client.client = stub;
  await expect(async () => {
    await client.exchangeTemporaryConnectionToken({});
  }).rejects.toThrow(InputError);
});

test('test exchange temporary connection token with token does not throw', async () => {
  const stub = new PlaidClientStub();
  const client = getClient();
  client.client = stub;
  await client.exchangeTemporaryConnectionToken({ token: 'token' });
});
