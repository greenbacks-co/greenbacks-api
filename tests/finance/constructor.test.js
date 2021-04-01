import 'babel-polyfill';

import { InputError } from 'errors';
import Client from 'finance';
import settings from 'settings';

test('test constructor without id throws input error', () => {
  expect(() => {
    new Client({
      env: 'sandbox',
      secret: settings.TRANSACTION_SECRET,
    });
  }).toThrow(InputError);
});

test('test constructor without secret throws input error', () => {
  expect(() => {
    new Client({
      env: 'sandbox',
      id: settings.TRANSACTION_ID,
    });
  }).toThrow(InputError);
});

test('test constructor without env throws input error', () => {
  expect(() => {
    new Client({
      id: settings.TRANSACTION_ID,
      secret: settings.TRANSACTION_SECRET,
    });
  }).toThrow(InputError);
});

test('test constructor with invalid env throws input error', () => {
  expect(() => {
    new Client({
      env: 'bad',
      id: settings.TRANSACTION_ID,
      secret: settings.TRANSACTION_SECRET,
    });
  }).toThrow(InputError);
});

test('test constructor with production env does not throw', () => {
  new Client({
    env: 'production',
    id: settings.TRANSACTION_ID,
    secret: settings.TRANSACTION_SECRET,
  });
});

test('test constructor with development env does not throw', () => {
  new Client({
    env: 'development',
    id: settings.TRANSACTION_ID,
    secret: settings.TRANSACTION_SECRET,
  });
});

test('test constructor with sandbox env does not throw', () => {
  new Client({
    env: 'sandbox',
    id: settings.TRANSACTION_ID,
    secret: settings.TRANSACTION_SECRET,
  });
});
