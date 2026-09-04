const reportSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    location: { type: 'string' },
    wasteType: { type: 'string', enum: ['Household', 'Plastic', 'Organic', 'Other'] },
    description: { type: 'string', maxLength: 300 },
    imageUrl: { type: 'string' },
    status: { type: 'string', enum: ['pending', 'in-progress', 'collected'] },
    reportedBy: { type: 'string' },
    user: { type: 'string', nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
  },
};

const errorSchema = {
  type: 'object',
  properties: {
    error: { type: 'string' },
  },
};

const userSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    role: { type: 'string', enum: ['citizen', 'admin'] },
    createdAt: { type: 'string', format: 'date-time' },
  },
};

const authResponseSchema = {
  type: 'object',
  properties: {
    token: { type: 'string' },
    user: userSchema,
  },
};

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'CleanLK API',
    version: '1.0.0',
    description: 'API for reporting and tracking garbage collection issues.',
  },
  servers: [{ url: '/' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Report: reportSchema,
      Error: errorSchema,
      User: userSchema,
      AuthResponse: authResponseSchema,
    },
  },
  paths: {
    '/api/health': {
      get: {
        summary: 'Health check',
        tags: ['Health'],
        responses: {
          200: {
            description: 'Server is up',
            content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' } } } } },
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        summary: 'Create a citizen account',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Account created', content: { 'application/json': { schema: authResponseSchema } } },
          400: { description: 'Validation error', content: { 'application/json': { schema: errorSchema } } },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Sign in',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Signed in', content: { 'application/json': { schema: authResponseSchema } } },
          400: { description: 'Missing credentials', content: { 'application/json': { schema: errorSchema } } },
          401: { description: 'Invalid credentials', content: { 'application/json': { schema: errorSchema } } },
        },
      },
    },
    '/api/auth/me': {
      get: {
        summary: 'Get the signed-in user',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Current user',
            content: { 'application/json': { schema: { type: 'object', properties: { user: userSchema } } } },
          },
          401: { description: 'Not signed in', content: { 'application/json': { schema: errorSchema } } },
        },
      },
    },
    '/api/reports': {
      post: {
        summary: 'Submit a report',
        tags: ['Reports'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['location', 'wasteType', 'description'],
                properties: {
                  location: { type: 'string' },
                  wasteType: { type: 'string', enum: ['Household', 'Plastic', 'Organic', 'Other'] },
                  description: { type: 'string', maxLength: 300 },
                  imageUrl: { type: 'string' },
                  reportedBy: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Report created', content: { 'application/json': { schema: reportSchema } } },
          400: { description: 'Validation error', content: { 'application/json': { schema: errorSchema } } },
        },
      },
      get: {
        summary: 'List reports',
        tags: ['Reports'],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'in-progress', 'collected'] } },
          { name: 'wasteType', in: 'query', schema: { type: 'string', enum: ['Household', 'Plastic', 'Organic', 'Other'] } },
          { name: 'area', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Matching reports',
            content: { 'application/json': { schema: { type: 'array', items: reportSchema } } },
          },
          400: { description: 'Invalid filter', content: { 'application/json': { schema: errorSchema } } },
        },
      },
    },
    '/api/reports/stats': {
      get: {
        summary: 'Aggregate report counts and top areas',
        tags: ['Reports'],
        responses: {
          200: {
            description: 'Aggregated stats',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    total: { type: 'integer' },
                    pending: { type: 'integer' },
                    inProgress: { type: 'integer' },
                    collected: { type: 'integer' },
                    topAreas: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: { area: { type: 'string' }, count: { type: 'integer' } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/reports/{id}': {
      get: {
        summary: 'Get a single report',
        tags: ['Reports'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Report found', content: { 'application/json': { schema: reportSchema } } },
          404: { description: 'Report not found', content: { 'application/json': { schema: errorSchema } } },
        },
      },
      patch: {
        summary: 'Update a report status (municipal staff only)',
        tags: ['Reports'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: { status: { type: 'string', enum: ['pending', 'in-progress', 'collected'] } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Report updated', content: { 'application/json': { schema: reportSchema } } },
          400: { description: 'Invalid status', content: { 'application/json': { schema: errorSchema } } },
          401: { description: 'Not signed in', content: { 'application/json': { schema: errorSchema } } },
          403: { description: 'Not an admin account', content: { 'application/json': { schema: errorSchema } } },
          404: { description: 'Report not found', content: { 'application/json': { schema: errorSchema } } },
        },
      },
      delete: {
        summary: 'Delete a report (municipal staff only)',
        tags: ['Reports'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Report deleted' },
          401: { description: 'Not signed in', content: { 'application/json': { schema: errorSchema } } },
          403: { description: 'Not an admin account', content: { 'application/json': { schema: errorSchema } } },
          404: { description: 'Report not found', content: { 'application/json': { schema: errorSchema } } },
        },
      },
    },
  },
};
