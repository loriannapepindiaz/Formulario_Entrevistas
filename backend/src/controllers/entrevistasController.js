const { createCrudController } = require('./crudControllerFactory');

module.exports = createCrudController({
  tableName: 'entrevista',
  entityName: 'Interview'
});
