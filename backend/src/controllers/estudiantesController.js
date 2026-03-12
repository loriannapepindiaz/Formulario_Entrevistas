const { createCrudController } = require('./crudControllerFactory');

module.exports = createCrudController({
  tableName: 'estudiantes',
  entityName: 'Student'
});
