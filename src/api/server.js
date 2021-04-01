import { Server } from 'api/graphql';
import resolvers from 'api/resolvers';
import schema from 'api/schema';

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
    console.log(query.trim());
    return {
      didEncounterErrors({ errors }) {
        let message = 'encountered errors:';
        errors.forEach((error) => {
          message += `\n  ${error.name}: ${error.message}`;
        });
        console.error(message);
      },
    };
  },
};

export default buildServer;
