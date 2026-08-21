import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'MySafeVault Core API',
        version: '1.0.0',
        description: 'Advanced API Documentation for MySafeVault. Covers WebAuthn flows, Passkeys, Vault Encryption, and User Management.',
        contact: {
          name: 'Security Team',
          email: 'security@mysafevault.app',
        }
      },
      tags: [
        { name: 'Authentication', description: 'WebAuthn and Passkey flows' },
        { name: 'Vault', description: 'Encrypted item storage and retrieval' },
        { name: 'System', description: 'Health checks and monitoring' }
      ],
      paths: {
        '/api/auth/webauthn/generate-registration-options': {
          get: {
            tags: ['Authentication'],
            summary: 'Generate Passkey Registration Options',
            description: 'Returns the challenge and options required to register a new WebAuthn passkey.',
            responses: {
              '200': { description: 'Registration options generated successfully' },
              '401': { description: 'Unauthorized' }
            }
          }
        },
        '/api/auth/webauthn/verify-registration': {
          post: {
            tags: ['Authentication'],
            summary: 'Verify Passkey Registration',
            description: 'Verifies the cryptographic signature from the authenticator to complete registration.',
            requestBody: {
              required: true,
              content: { 'application/json': { schema: { type: 'object' } } }
            },
            responses: {
              '200': { description: 'Passkey registered and verified successfully' },
              '400': { description: 'Invalid signature' }
            }
          }
        },
        '/api/vault/items': {
          get: {
            tags: ['Vault'],
            summary: 'Get Encrypted Vault Items',
            description: 'Retrieves all encrypted items stored in the user\'s vault.',
            security: [{ BearerAuth: [] }],
            responses: {
              '200': { description: 'Successfully retrieved vault items' },
              '401': { description: 'Unauthorized' }
            }
          },
          post: {
            tags: ['Vault'],
            summary: 'Add New Encrypted Item',
            description: 'Stores a new AES-256-GCM encrypted item in the vault.',
            security: [{ BearerAuth: [] }],
            requestBody: {
              required: true,
              content: { 'application/json': { schema: { type: 'object', properties: { encryptedData: { type: 'string' }, iv: { type: 'string' } } } } }
            },
            responses: {
              '201': { description: 'Item created' }
            }
          }
        }
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [],
    },
  });
  return spec;
};
