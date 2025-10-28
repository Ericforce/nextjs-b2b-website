// Minimal CommonJS config export for tools that import schema without Sanity dependencies
const { schemaTypes } = require('./schemas');

module.exports = {
  schema: { types: schemaTypes },
};
