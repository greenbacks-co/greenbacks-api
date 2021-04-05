import 'babel-polyfill';

import Client, { AuthenticationError, TokenError } from 'finance';
import settings from 'settings';

const getConstructorInput = () => ({
  env: 'sandbox',
  id: settings.TRANSACTION_ID,
  secret: settings.TRANSACTION_SECRET,
});

const getInput = () => ({
  end: '2021-01-31',
  start: '2021-01-01',
  token: 'access-sandbox-6fabc8e0-18ee-4bb9-9593-50f94cf26f0d',
});

test('test with bad id in constructor throws authentication error', async () => {
  const constructorInput = getConstructorInput();
  constructorInput.id = 'bad';
  const input = getInput();
  const client = new Client(constructorInput);
  await expect(async () => {
    await client.listTransactions(input);
  }).rejects.toThrow(AuthenticationError);
});

test('test with bad secret in constructor throws authentication error', async () => {
  const constructorInput = getConstructorInput();
  constructorInput.secret = 'bad';
  const input = getInput();
  const client = new Client(constructorInput);
  await expect(async () => {
    await client.listTransactions(input);
  }).rejects.toThrow(AuthenticationError);
});

test('test with bad token throws token error', async () => {
  const constructorInput = getConstructorInput();
  const input = getInput();
  input.token = 'bad';
  const client = new Client(constructorInput);
  await expect(async () => {
    await client.listTransactions(input);
  }).rejects.toThrow(TokenError);
});

test('test with correct input is successful', async () => {
  const constructorInput = getConstructorInput();
  const input = getInput();
  const client = new Client(constructorInput);
  const transactions = await client.listTransactions(input);
  expect(transactions.length).toBeGreaterThan(0);
});
