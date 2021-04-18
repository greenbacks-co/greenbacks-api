import 'babel-polyfill';

import { InputError } from 'errors';
import Transactions from 'storage/models/pendingTransactions';

const getInput = () => ({
  environment: 'test',
  storageClient: 'test',
  user: 'test',
});

test('test constructor without environment throws input error', () => {
  const input = getInput();
  delete input.environment;
  expect(() => {
    new Transactions(input);
  }).toThrow(InputError);
});

test('test constructor without storageClient throws input error', () => {
  const input = getInput();
  delete input.storageClient;
  expect(() => {
    new Transactions(input);
  }).toThrow(InputError);
});

test('test constructor without user throws input error', () => {
  const input = getInput();
  delete input.user;
  expect(() => {
    new Transactions(input);
  }).toThrow(InputError);
});

test('test constructor with correct input does not throw', () => {
  const input = getInput();
  new Transactions(input);
});
