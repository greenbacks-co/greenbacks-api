import { InputError } from 'errors';
import {
  AuthenticationError,
  isAuthenticationError,
  MissingTableError,
} from './errors';

const listItems = (input) => {
  validateInput(input);
  const { client, key, table } = input;
  return new Promise((resolve, reject) => {
    const queryParameters = buildQueryParameters({ key, table });
    client.query(queryParameters, (error, result) => {
      if (error) {
        if (isAuthenticationError(error)) {
          reject(new AuthenticationError());
          return;
        }
        if (error.name === 'ResourceNotFoundException') {
          reject(new MissingTableError(table));
          return;
        }
        reject(error);
        return;
      }
      resolve(result.Items);
    });
  });
};

const validateInput = ({ client, key: { partition } = {}, table }) => {
  if (!client) throw new InputError('client');
  if (!table) throw new InputError('table');
  if (
    !partition ||
    typeof partition !== 'object' ||
    Object.keys(partition).length !== 1
  )
    throw new InputError('partition', 'key');
};

const buildQueryParameters = ({ key: { partition }, table }) => ({
  ExpressionAttributeNames: { '#partitionName': Object.keys(partition)[0] },
  ExpressionAttributeValues: {
    ':partitionValue': Object.values(partition)[0],
  },
  KeyConditionExpression: '#partitionName = :partitionValue',
  TableName: table,
});

export default listItems;
