import { InputError } from 'errors';

class Transactions {
  constructor(input) {
    validateConstructorInput(input);
    const { environment, storageClient, user } = input;
    this.storageClient = storageClient;
    this.table = `${environment}-transactions`;
    this.user = user;
  }

  async create(input) {
    validateCreateInput(input);
    this.storageClient.addItemsAndCreateTable({ table: this.table });
  }
}

const validateConstructorInput = ({ environment, storageClient, user }) => {
  if (!environment) throw new InputError();
  if (!storageClient) throw new InputError();
  if (!user) throw new InputError();
};

const validateCreateInput = ({}) => {};

export default Transactions;
