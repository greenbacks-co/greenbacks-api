import { InputError } from 'errors';
import {
  AuthenticationError,
  InvalidKeyError,
  isAuthenticationError,
  isInvalidKeyError,
  MissingTableError,
} from './errors';

const addItems = (input) => {
  validateInput(input);
  const { client, items, table } = input;
  return new Promise((resolve, reject) => {
    client.batchWrite(buildParameters({ items, table }), (error) => {
      if (error) {
        if (isAuthenticationError(error)) reject(new AuthenticationError());
        if (isInvalidKeyError(error)) reject(new InvalidKeyError());
        if (error.name === 'ResourceNotFoundException')
          reject(new MissingTableError(table));
        reject(error);
      }
      resolve();
    });
  });
};

const validateInput = ({ client, items, table }) => {
  if (!client) throw new InputError('client');
  if (!items) throw new InputError('items');
  if (items.length === 0) throw new InputError('items');
  items.forEach((item) => {
    if (Object.keys(item).length === 0) throw new InputError('items');
  });
  if (!table) throw new InputError('items');
};

const buildParameters = ({ items, table }) => {
  const puts = items.map((item) => ({
    PutRequest: {
      Item: item,
    },
  }));
  return {
    RequestItems: {
      [table]: puts,
    },
  };
};

export default addItems;
