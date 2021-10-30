import 'babel-polyfill';

import { InputError } from 'errors';
import Updates from 'storage/models/transactionUpdates';

const getInput = () => ({
  environment: 'test',
  storageClient: 'test',
  user: 'test',
});

test('test constructor without environment throws input error', () => {
  const input = getInput();
  delete input.environment;
  expect(() => {
    new Updates(input);
  }).toThrow(InputError);
});

test('test constructor without storageClient throws input error', () => {
  const input = getInput();
  delete input.storageClient;
  expect(() => {
    new Updates(input);
  }).toThrow(InputError);
});

test('test constructor without user throws input error', () => {
  const input = getInput();
  delete input.user;
  expect(() => {
    new Updates(input);
  }).toThrow(InputError);
});

test('test constructor with correct input does not throw', () => {
  const input = getInput();
  new Updates(input);
});
