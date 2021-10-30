import 'babel-polyfill';

import { InputError } from 'errors';
import Transactions from 'storage/models/transactions';
import { ISO_FORMAT } from '../../utils';

class ClientStub {
  constructor() {
    this.arguments = {};
  }

  async addItemsAndCreateTable({ items, key, table }) {
    this.arguments = { items, key, table };
  }
}

const getConstructorInput = (storageClient) => ({
  environment: 'test',
  storageClient,
  user: 'test',
});

const getInput = () => [
  {
    account_id: 'test',
    amount: 42,
    date: '2000-01-01',
    iso_currency_code: 'test',
    merchant_name: 'test',
    name: 'test',
    pending: false,
    transaction_id: 'test',
  },
];

test('test create with environment foo calls create with table foo-transactions', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  constructorInput.environment = 'foo';
  const transactions = new Transactions(constructorInput);
  const input = getInput();
  await transactions.create(input);
  expect(stub.arguments.table).toBe('foo-transactions');
});

test('test create with environment bar calls create with table bar-transactions', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  constructorInput.environment = 'bar';
  const transactions = new Transactions(constructorInput);
  const input = getInput();
  await transactions.create(input);
  expect(stub.arguments.table).toBe('bar-transactions');
});

test('test create with user foo calls create with user foo', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  constructorInput.user = 'foo';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].user).toBe('foo');
});

test('test create with user bar calls create with user bar', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  constructorInput.user = 'bar';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].user).toBe('bar');
});

test('test create has matching createdDate and modifiedDate', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].createdDate).toMatch(ISO_FORMAT);
  expect(stub.arguments.items[0].modifiedDate).toMatch(ISO_FORMAT);
  expect(stub.arguments.items[0].createdDate).toBe(
    stub.arguments.items[0].modifiedDate
  );
});

test('test create with extra value calls create with extra value in raw', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input.foo = 'bar';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].raw.foo).toBe('bar');
});

test('test create calls create with correct key', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.key).toStrictEqual({
    partition: {
      name: 'user',
      type: 'string',
    },
    sort: {
      name: 'status#transactionDate',
      type: 'string',
    },
  });
});

test('test create without account id throws input error', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  delete input[0].account_id;
  const transactions = new Transactions(constructorInput);
  await expect(async () => {
    await transactions.create(input);
  }).rejects.toThrow(InputError);
});

test('test create with account id foo calls create with account id foo', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].account_id = 'foo';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].accountId).toBe('foo');
});

test('test create with account id bar calls create with account id bar', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].account_id = 'bar';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].accountId).toBe('bar');
});

test('test create with account id foo calls create with account id foo in raw', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].account_id = 'foo';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].raw.account_id).toBe('foo');
});

test('test create with account id bar calls create with account id bar in raw', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].account_id = 'bar';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].raw.account_id).toBe('bar');
});

test('test create without amount throws input error', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  delete input[0].amount;
  const transactions = new Transactions(constructorInput);
  await expect(async () => {
    await transactions.create(input);
  }).rejects.toThrow(InputError);
});

test('test create with amount 3.50 calls create with amount 3.50', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].amount = 3.5;
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].amount).toBe(3.5);
});

test('test create with amount 0.99 calls create with amount 0.99', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].amount = 0.99;
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].amount).toBe(0.99);
});

test('test create with amount 3.50 calls create with amount 3.50 in raw', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].amount = 3.5;
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].raw.amount).toBe(3.5);
});

test('test create with amount 0.99 calls create with amount 0.99 in raw', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].amount = 0.99;
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].raw.amount).toBe(0.99);
});

test('test create without date throws input error', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  delete input[0].date;
  const transactions = new Transactions(constructorInput);
  await expect(async () => {
    await transactions.create(input);
  }).rejects.toThrow(InputError);
});

test('test create with date 2020-01-01 calls create with date 2020-01-01', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].date = '2020-01-01';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].date).toBe('2020-01-01');
});

test('test create with date 2010-01-01 calls create with date 2010-01-01', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].date = '2010-01-01';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].date).toBe('2010-01-01');
});

test('test create with date 2020-01-01 calls create with date 2020-01-01 in raw', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].date = '2020-01-01';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].raw.date).toBe('2020-01-01');
});

test('test create with date 2010-01-01 calls create with date 2010-01-01 in raw', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].date = '2010-01-01';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].raw.date).toBe('2010-01-01');
});

test('test create without iso currency code throws input error', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  delete input[0].iso_currency_code;
  const transactions = new Transactions(constructorInput);
  await expect(async () => {
    await transactions.create(input);
  }).rejects.toThrow(InputError);
});

test('test create with iso currency code CAD calls create with currency CAD', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].iso_currency_code = 'CAD';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].currency).toBe('CAD');
});

test('test create with iso currency code USD calls create with currency USD', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].iso_currency_code = 'USD';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].currency).toBe('USD');
});

test('test create with iso currency code CAD calls create with iso currency code CAD in raw', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].iso_currency_code = 'CAD';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].raw.iso_currency_code).toBe('CAD');
});

test('test create with iso currency code USD calls create with iso currency code USD in raw', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].iso_currency_code = 'USD';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].raw.iso_currency_code).toBe('USD');
});

test('test create without merchant name throws input error', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  delete input[0].merchant_name;
  const transactions = new Transactions(constructorInput);
  await expect(async () => {
    await transactions.create(input);
  }).rejects.toThrow(InputError);
});

test('test create with merchant name amazon calls create with merchant amazon', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].merchant_name = 'amazon';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].merchant).toBe('amazon');
});

test('test create with merchant name chapters calls create with merchant chapters', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].merchant_name = 'chapters';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].merchant).toBe('chapters');
});

test('test create with merchant name amazon calls create with merchant name amazon in raw', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].merchant_name = 'amazon';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].raw.merchant_name).toBe('amazon');
});

test('test create with merchant name chapters calls create with merchant name chapters in raw', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].merchant_name = 'chapters';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].raw.merchant_name).toBe('chapters');
});

test('test create without name throws input error', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  delete input[0].name;
  const transactions = new Transactions(constructorInput);
  await expect(async () => {
    await transactions.create(input);
  }).rejects.toThrow(InputError);
});

test('test create with name amazon calls create with name amazon', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].name = 'amazon';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].name).toBe('amazon');
});

test('test create with name chapters calls create with name chapters', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].name = 'chapters';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].name).toBe('chapters');
});

test('test create with name amazon calls create with name amazon in raw', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].name = 'amazon';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].raw.name).toBe('amazon');
});

test('test create with name chapters calls create with name chapters in raw', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].name = 'chapters';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].raw.name).toBe('chapters');
});

test('test create without pending throws input error', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  delete input[0].pending;
  const transactions = new Transactions(constructorInput);
  await expect(async () => {
    await transactions.create(input);
  }).rejects.toThrow(InputError);
});

test('test create with pending true calls create with status pending', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].pending = true;
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].status).toBe('pending');
});

test('test create with pending false calls create with status posted', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].pending = false;
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].status).toBe('posted');
});

test('test create with pending true calls create with pending true in raw', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].pending = true;
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].raw.pending).toBe(true);
});

test('test create with pending false calls create with pending false in raw', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].pending = false;
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].raw.pending).toBe(false);
});

test('test create without transaction id throws input error', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  delete input[0].transaction_id;
  const transactions = new Transactions(constructorInput);
  await expect(async () => {
    await transactions.create(input);
  }).rejects.toThrow(InputError);
});

test('test create with transaction id foo calls create with transaction id foo', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].transaction_id = 'foo';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].transactionId).toBe('foo');
});

test('test create with transaction id bar calls create with transaction id bar', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].transaction_id = 'bar';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].transactionId).toBe('bar');
});

test('test create with transaction id foo calls create with transaction id foo in raw', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].transaction_id = 'foo';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].raw.transaction_id).toBe('foo');
});

test('test create with transaction id bar calls create with transaction id bar in raw', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input[0].transaction_id = 'bar';
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items[0].raw.transaction_id).toBe('bar');
});

test('test create with second item calls create with extra item', async () => {
  const stub = new ClientStub();
  const constructorInput = getConstructorInput(stub);
  const input = getInput();
  input.push(input[0]);
  const transactions = new Transactions(constructorInput);
  await transactions.create(input);
  expect(stub.arguments.items.length).toBe(2);
});
