import { InputError } from 'errors';
import logger from 'utils/logger';
import {
  AuthenticationError,
  isAuthenticationError,
  TableExistsError,
} from './errors';

const createTable = (input) => {
  validateInput(input);
  const { client, key, name } = input;
  const commandInput = {
    AttributeDefinitions: buildAttributeDefinitions(key),
    BillingMode: 'PAY_PER_REQUEST',
    KeySchema: buildKeySchema(key),
    TableName: name,
  };
  return new Promise((resolve, reject) => {
    client.createTable(commandInput, (error) => {
      if (error) {
        if (isAuthenticationError(error)) reject(new AuthenticationError());
        if (isTableExistsError(error)) reject(new TableExistsError(name));
        reject(error);
      }
      setTimeout(() => {
        logger.info(`created table '${name}'`);
        resolve();
      }, 7000);
    });
  });
};

const validateInput = ({ client, key, name }) => {
  if (!client) throw new InputError('client');
  if (!key) throw new InputError('key');
  const { partition, sort } = key;
  if (!partition) throw new InputError('partition', 'key');
  if (!partition.name) throw new InputError('name', 'partition');
  if (!partition.type || !isValidType(partition.type))
    throw new InputError('type', 'partition');
  if (sort && !sort.name) throw new InputError('name', 'sort');
  if (sort && (!sort.type || !isValidType(sort.type)))
    throw new InputError('type', 'sort');
  if (!name) throw new InputError('name');
};

const isValidType = (type) => ['boolean', 'number', 'string'].includes(type);

const buildAttributeDefinitions = ({ partition, sort }) => {
  const attributeDefinitions = [
    {
      AttributeName: partition.name,
      AttributeType: TYPES[partition.type],
    },
  ];
  if (sort)
    attributeDefinitions.push({
      AttributeName: sort.name,
      AttributeType: TYPES[sort.type],
    });
  return attributeDefinitions;
};

const TYPES = {
  boolean: 'B',
  number: 'N',
  string: 'S',
};

const buildKeySchema = ({ partition, sort }) => {
  const schema = [
    {
      AttributeName: partition.name,
      KeyType: 'HASH',
    },
  ];
  if (sort) schema.push({ AttributeName: sort.name, KeyType: 'RANGE' });
  return schema;
};

const isTableExistsError = (error) =>
  error.name === 'ResourceInUseException' &&
  (error.message.startsWith('Table already exists') ||
    error.message.startsWith(
      'Attempt to change a resource which is still in use'
    ));

export default createTable;
