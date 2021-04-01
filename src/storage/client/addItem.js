import { InputError } from 'errors';
import {
  AuthenticationError,
  InvalidKeyError,
  isAuthenticationError,
  isInvalidKeyError,
  MissingTableError,
} from './errors';

const addItem = (input) => {
  validateInput(input);
  const { client, item, table } = input;
  return new Promise((resolve, reject) => {
    client.put(
      {
        Item: item,
        TableName: table,
      },
      (error) => {
        if (error) {
          if (isAuthenticationError(error)) reject(new AuthenticationError());
          if (isInvalidKeyError(error)) reject(new InvalidKeyError());
          if (error.name === 'ResourceNotFoundException')
            reject(new MissingTableError(table));
          reject(error);
        }
        resolve();
      }
    );
  });
};

const validateInput = ({ client, item, table }) => {
  if (!client) throw new InputError('client');
  if (!item || Object.keys(item).length === 0) throw new InputError('item');
  if (!table) throw new InputError('item');
};

export default addItem;
