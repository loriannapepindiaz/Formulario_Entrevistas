const { createCrudController } = require('./crudControllerFactory');

module.exports = createCrudController({
  tableName: 'entrevistas',
  entityName: 'Interview'
});
