const { createCrudController } = require('./crudControllerFactory');

module.exports = createCrudController({
  tableName: 'padres',
  entityName: 'Parent or tutor'
});
