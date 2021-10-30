import { Client, environments } from 'plaid';

import { InputError } from 'errors';

const PAGE_SIZE = 500;

class FinanceClient {
  constructor(input) {
    validateConstructorInput(input);
    const { client, env, id, secret } = input;
    if (client) this.client = client;
    else {
      this.client = new Client({
        clientID: id,
        env: environments[env],
        secret,
        options: {
          version: '2019-05-29',
        },
      });
    }
  }

  async createConnectionInitializationToken(input) {
    validateCreateConnectionInitializationTokenInput(input);
    const { id } = input;
    const settings = {
      client_name: 'Greenbacks',
      country_codes: ['US', 'CA'],
      language: 'en',
      products: ['transactions'],
      user: { client_user_id: id },
    };
    try {
      const response = await this.client.createLinkToken(settings);
      return response.link_token;
    } catch (error) {
      if (error.message === 'INVALID_FIELD') throw new AuthenticationError();
      throw error;
    }
  }

  async describeConnection(input) {
    validateDescribeAccountInput(input);
    const { token } = input;
    let institution;
    let item;
    try {
      item = await this.client.getItem(token);
      institution = await this.client.getInstitutionById(
        item.item.institution_id
      );
    } catch (error) {
      if (error.message === 'INVALID_FIELD') throw new AuthenticationError();
      throw error;
    }
    const {
      institution: { institution_id: institutionId, name },
    } = institution;
    return {
      institutionId,
      name,
    };
  }

  async exchangeTemporaryConnectionToken(input) {
    validateExchangeTemporaryConnectionTokenInput(input);
    const { token } = input;
    try {
      const response = await this.client.exchangePublicToken(token);
      return { accessToken: response.access_token, id: response.item_id };
    } catch (error) {
      if (error.message === 'INVALID_FIELD') throw new AuthenticationError();
      throw new TokenError();
    }
  }

  async listTransactions(input) {
    validateListTransactionsInput(input);
    const { end, start, page = 1, token } = input;
    const offset = (page - 1) * PAGE_SIZE;
    try {
      const result = await this.client.getTransactions(token, start, end, {
        count: PAGE_SIZE,
        offset,
      });
      return result.transactions;
    } catch (error) {
      if (error.message === 'INVALID_FIELD') throw new AuthenticationError();
      if (error.message === 'INVALID_ACCESS_TOKEN') throw new TokenError();
      throw error;
    }
  }
}

const validateConstructorInput = ({ env, id, secret }) => {
  if (!env || !(env in environments)) throw new InputError('env');
  if (!id) throw new InputError('id');
  if (!secret) throw new InputError('secret');
};

const validateCreateConnectionInitializationTokenInput = ({ id }) => {
  if (!id) throw new InputError('id');
};

const validateDescribeAccountInput = ({ token }) => {
  if (!token) throw new InputError('token');
};

const validateExchangeTemporaryConnectionTokenInput = ({ token }) => {
  if (!token) throw new InputError('token');
};

const validateListTransactionsInput = ({ end, start, token }) => {
  if (!end) throw new InputError('end');
  if (!start) throw new InputError('start');
  if (!token) throw new InputError('token');
  if (start > end) throw new InputError('end');
};

export class AuthenticationError extends Error {
  constructor() {
    super('Failed to authenticate with transaction server');
  }
}

export class TokenError extends Error {
  constructor() {
    super('Invalid token');
  }
}

export default FinanceClient;
