const { createCrudController } = require('./crudControllerFactory');

module.exports = createCrudController({
  tableName: 'estudiante',
  entityName: 'Student'
});
