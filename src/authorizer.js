import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';

import settings from 'settings';

const authorize = async (event, context) => {
  try {
    validateEnvironment();
    return await authenticate(event);
  } catch (error) {
    return context.fail('Unauthorized');
  }
};

const validateEnvironment = () => {
  if (!settings.JWKS_URI) throw new Error('missing JWKS_URI');
};

const authenticate = async (params) => {
  const token = getToken(params);
  const decodedToken = decodeToken(token);
  const signingKey = await getSigningKey(decodedToken);
  const verifiedToken = await verifyToken(token, signingKey);
  return formatResponse(params, verifiedToken);
};

const getToken = (params) => {
  if (!params.type || params.type !== 'TOKEN') {
    throw new Error('Expected "event.type" parameter to have value "TOKEN"');
  }

  const tokenString = params.authorizationToken;
  if (!tokenString) {
    throw new Error('Expected "event.authorizationToken" parameter to be set');
  }

  const match = tokenString.match(/^Bearer (.*)$/);
  if (!match || match.length < 2) {
    throw new Error(
      `Invalid Authorization token - ${tokenString} does not match "Bearer .*"`
    );
  }
  return match[1];
};

export const decodeToken = (token) => {
  const decoded = jwt.decode(token, { complete: true });
  if (!decoded || !decoded.header || !decoded.header.kid) {
    throw new Error('invalid token');
  }
  return decoded;
};

const getSigningKey = async (decodedToken) => {
  const client = jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10, // Default value
    jwksUri: settings.JWKS_URI || '',
  });
  const signingKey = await client.getSigningKeyAsync(decodedToken.header.kid);
  return signingKey.publicKey || signingKey.rsaPublicKey;
};

const verifyToken = async (token, signingKey) =>
  jwt.verify(token, signingKey, {
    algorithms: ['RS256'],
    audience: settings.AUDIENCE,
    issuer: settings.TOKEN_ISSUER,
  });

const formatResponse = (params, verifiedToken) => ({
  principalId: verifiedToken.sub,
  policyDocument: {
    Version: '2012-10-17', // default version
    Statement: [
      {
        Action: 'execute-api:Invoke', // default action
        Effect: 'Allow',
        Resource: params.methodArn,
      },
    ],
  },
  context: { scope: verifiedToken.scope },
});

export default authorize;
