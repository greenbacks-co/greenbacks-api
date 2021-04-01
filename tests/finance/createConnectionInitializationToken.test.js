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
  async createLinkToken() {
    return { link_token: 'test' };
  }
}

test('test create connection initialization token without id throws input error', async () => {
  const stub = new PlaidClientStub();
  const client = getClient();
  client.client = stub;
  expect(async () => {
    await client.createConnectionInitializationToken({});
  }).rejects.toThrow(InputError);
});

test('test create connection initialization token with id does not throw', async () => {
  const stub = new PlaidClientStub();
  const client = getClient();
  client.client = stub;
  await client.createConnectionInitializationToken({ id: 'id' });
});
