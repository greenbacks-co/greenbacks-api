import { InputError } from 'errors';

class TransactionUpdates {
  constructor(input) {
    validateConstructorInput(input);
    const { environment, storageClient, user } = input;
    this.environment = environment;
    this.storageClient = storageClient;
    this.user = user;
  }
}

const validateConstructorInput = ({ environment, storageClient, user }) => {
  if (!environment) throw new InputError('environment');
  if (!storageClient) throw new InputError('storageClient');
  if (!user) throw new InputError('user');
};

export default TransactionUpdates;
