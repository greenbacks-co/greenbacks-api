import 'babel-polyfill';

import { InputError } from 'errors';
import { Connections } from 'storage/models';

test('test constructor without storageClient throws input error', () => {
  expect(() => {
    new Connections({ environment: 'foo', user: 'test' });
  }).toThrow(InputError);
});

test('test constructor without environment throws input error', () => {
  expect(() => {
    new Connections({ storageClient: 'test', user: 'test' });
  }).toThrow(InputError);
});

test('test constructor without user throws input error', () => {
  expect(() => {
    new Connections({ environment: 'foo', storageClient: 'test' });
  }).toThrow(InputError);
});

test('test constructor with correct input does not throw', () => {
  new Connections({ environment: 'foo', storageClient: 'test', user: 'test' });
});
