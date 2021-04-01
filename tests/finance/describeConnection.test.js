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
      resolve();
    });
  }

  async getItem(_input) {
    return new Promise((resolve) => {
      resolve({
        item: {
          institution_id: 1,
        },
      });
    });
  }

  async getInstitutionById(_input) {
    return new Promise((resolve) => {
      resolve({
        institution: {
          institution_id: '1',
          name: 'test bank',
        },
      });
    });
  }
}

test('test describe connection without token throws input error', async () => {
  const stub = new PlaidClientStub();
  const client = getClient();
  client.client = stub;
  await expect(async () => {
    await client.describeConnection({});
  }).rejects.toThrow(InputError);
});

test('test describe connection with token does not throw', async () => {
  const stub = new PlaidClientStub();
  const client = getClient();
  client.client = stub;
  await client.describeConnection({ token: 'token' });
});
