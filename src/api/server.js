import { Server } from 'api/graphql';
import resolvers from 'api/resolvers';
import schema from 'api/schema';
import logger from 'utils/logger';

const buildServer = ({ buildClients, environment, parseUser }) =>
  new Server({
    context: ({ event }) => {
      const token = event.headers.authorization;
      return {
        environment,
        user: parseUser({ token }),
      };
    },
    dataSources: buildClients,
    playground: {
      endpoint: '/dev/graphql',
    },
    plugins: [loggingPlugin],
    resolvers,
    typeDefs: schema,
  });

const loggingPlugin = {
  requestDidStart({ request: { query } }) {
    logger.debug(query.trim());
    return {
      didEncounterErrors({ errors }) {
        logger.error(errors);
        errors.forEach((error) => {
          logger.error(error.stack);
        });
      },
    };
  },
};

export default buildServer;
