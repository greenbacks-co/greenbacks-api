import 'babel-polyfill';

import { InputError } from 'errors';
import Client, { AuthenticationError } from 'finance';
import settings from 'settings';

class PlaidStub {
  constructor({
    result = { transactions: [] },
    shouldThrow = false,
    shouldThrowAuthenticationError,
  } = {}) {
    this.arguments = {};
    this.result = result;
    this.shouldThrow = shouldThrow;
    this.shouldThrowAuthenticationError = shouldThrowAuthenticationError;
  }

  async getTransactions(token, start, end, page) {
    if (this.shouldThrow) throw new Error();
    if (this.shouldThrowAuthenticationError) {
      throw { message: 'INVALID_FIELD' };
    }
    this.arguments = { end, start, page, token };
    return this.result;
  }
}

const getClient = (stub) =>
  new Client({
    client: stub,
    env: 'sandbox',
    id: settings.TRANSACTION_ID,
    secret: settings.TRANSACTION_SECRET,
  });

const getInput = () => ({
  end: '2021-01-31',
  page: 1,
  start: '2021-01-01',
  token: 'foo',
});

test('test without token throws input error', async () => {
  const stub = new PlaidStub();
  const client = getClient(stub);
  const input = getInput();
  delete input.token;
  await expect(async () => {
    await client.listTransactions(input);
  }).rejects.toThrow(InputError);
});

test('test with token foo calls client with token foo', async () => {
  const stub = new PlaidStub();
  const client = getClient(stub);
  const input = getInput();
  await client.listTransactions(input);
  expect(stub.arguments.token).toBe('foo');
});

test('test with token bar calls client with token bar', async () => {
  const stub = new PlaidStub();
  const client = getClient(stub);
  const input = getInput();
  input.token = 'bar';
  await client.listTransactions(input);
  expect(stub.arguments.token).toBe('bar');
});

test('test without page does not throw', async () => {
  const stub = new PlaidStub();
  const client = getClient(stub);
  const input = getInput();
  delete input.page;
  await client.listTransactions(input);
});

test('test with page 1 calls client with count 250', async () => {
  const stub = new PlaidStub();
  const client = getClient(stub);
  const input = getInput();
  await client.listTransactions(input);
  expect(stub.arguments.page.count).toBe(250);
});

test('test with page 1 calls client with offset 0', async () => {
  const stub = new PlaidStub();
  const client = getClient(stub);
  const input = getInput();
  await client.listTransactions(input);
  expect(stub.arguments.page.offset).toBe(0);
});

test('test with page 2 calls client with count 250', async () => {
  const stub = new PlaidStub();
  const client = getClient(stub);
  const input = getInput();
  input.page = 2;
  await client.listTransactions(input);
  expect(stub.arguments.page.count).toBe(250);
});

test('test with page 2 calls client with offset 250', async () => {
  const stub = new PlaidStub();
  const client = getClient(stub);
  const input = getInput();
  input.page = 2;
  await client.listTransactions(input);
  expect(stub.arguments.page.offset).toBe(250);
});

test('test without page calls client with count 250', async () => {
  const stub = new PlaidStub();
  const client = getClient(stub);
  const input = getInput();
  delete input.page;
  await client.listTransactions(input);
  expect(stub.arguments.page.count).toBe(250);
});

test('test without page calls client with offset 0', async () => {
  const stub = new PlaidStub();
  const client = getClient(stub);
  const input = getInput();
  delete input.page;
  await client.listTransactions(input);
  expect(stub.arguments.page.offset).toBe(0);
});

test('test without start throws input error', async () => {
  const stub = new PlaidStub();
  const client = getClient(stub);
  const input = getInput();
  delete input.start;
  await expect(async () => {
    await client.listTransactions(input);
  }).rejects.toThrow(InputError);
});

test('test without end throws input error', async () => {
  const stub = new PlaidStub();
  const client = getClient(stub);
  const input = getInput();
  delete input.end;
  await expect(async () => {
    await client.listTransactions(input);
  }).rejects.toThrow(InputError);
});

test('test with start 2021-01-01 calls client with start 2021-01-01', async () => {
  const stub = new PlaidStub();
  const client = getClient(stub);
  const input = getInput();
  await client.listTransactions(input);
  expect(stub.arguments.start).toBe('2021-01-01');
});

test('test with start 2021-02-01 calls client with start 2021-02-01', async () => {
  const stub = new PlaidStub();
  const client = getClient(stub);
  const input = getInput();
  input.start = '2021-02-01';
  await client.listTransactions(input);
  expect(stub.arguments.start).toBe('2021-02-01');
});

test('test with end 2021-01-31 calls client with end 2021-01-31', async () => {
  const stub = new PlaidStub();
  const client = getClient(stub);
  const input = getInput();
  await client.listTransactions(input);
  expect(stub.arguments.end).toBe('2021-01-31');
});

test('test with end 2021-02-28 calls client with end 2021-02-28', async () => {
  const stub = new PlaidStub();
  const client = getClient(stub);
  const input = getInput();
  input.end = '2021-02-28';
  await client.listTransactions(input);
  expect(stub.arguments.end).toBe('2021-02-28');
});

test('test with authentication error throws authentication error', async () => {
  const stub = new PlaidStub({ shouldThrowAuthenticationError: true });
  const client = getClient(stub);
  const input = getInput();
  await expect(async () => {
    await client.listTransactions(input);
  }).rejects.toThrow(AuthenticationError);
});

test('test with error throws error', async () => {
  const stub = new PlaidStub({ shouldThrow: true });
  const client = getClient(stub);
  const input = getInput();
  await expect(async () => {
    await client.listTransactions(input);
  }).rejects.toThrow(Error);
});

test('test with correct input returns correct result', async () => {
  const stub = new PlaidStub({ result: { transactions: [{ foo: 'bar' }] } });
  const client = getClient(stub);
  const input = getInput();
  const transactions = await client.listTransactions(input);
  expect(transactions).toStrictEqual([{ foo: 'bar' }]);
});
