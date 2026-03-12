const { pool } = require('../config/db');

const IDENTIFIER_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

const validateIdentifier = (identifier) => {
  if (!IDENTIFIER_REGEX.test(identifier)) {
    throw new Error(`Invalid SQL identifier: ${identifier}`);
  }

  return identifier;
};

const buildInsertQuery = (tableName, payload) => {
  const keys = Object.keys(payload || {});

  if (keys.length === 0) {
    const error = new Error('Request body cannot be empty.');
    error.statusCode = 400;
    throw error;
  }

  const columns = keys.map(validateIdentifier);
  const placeholders = columns.map((_, index) => `$${index + 1}`);
  const values = columns.map((column) => payload[column]);

  const query = `
    INSERT INTO ${validateIdentifier(tableName)} (${columns.join(', ')})
    VALUES (${placeholders.join(', ')})
    RETURNING *;
  `;

  return { query, values };
};

const buildUpdateQuery = (tableName, id, payload) => {
  const keys = Object.keys(payload || {});

  if (keys.length === 0) {
    const error = new Error('Request body cannot be empty.');
    error.statusCode = 400;
    throw error;
  }

  const columns = keys.map(validateIdentifier);
  const setClause = columns.map((column, index) => `${column} = $${index + 1}`);
  const values = columns.map((column) => payload[column]);
  values.push(id);

  const query = `
    UPDATE ${validateIdentifier(tableName)}
    SET ${setClause.join(', ')}
    WHERE id = $${columns.length + 1}
    RETURNING *;
  `;

  return { query, values };
};

const createCrudController = ({ tableName, entityName }) => {
  const createOne = async (req, res, next) => {
    try {
      const { query, values } = buildInsertQuery(tableName, req.body);
      const result = await pool.query(query, values);

      res.status(201).json({
        status: 'success',
        message: `${entityName} created successfully.`,
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  };

  const getAll = async (req, res, next) => {
    try {
      const result = await pool.query(`SELECT * FROM ${validateIdentifier(tableName)} ORDER BY id ASC;`);

      res.status(200).json({
        status: 'success',
        message: `${entityName} list retrieved successfully.`,
        data: result.rows
      });
    } catch (error) {
      next(error);
    }
  };

  const getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await pool.query(`SELECT * FROM ${validateIdentifier(tableName)} WHERE id = $1;`, [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({
          status: 'error',
          message: `${entityName} not found.`,
          data: null
        });
      }

      res.status(200).json({
        status: 'success',
        message: `${entityName} retrieved successfully.`,
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  };

  const updateById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { query, values } = buildUpdateQuery(tableName, id, req.body);
      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        return res.status(404).json({
          status: 'error',
          message: `${entityName} not found.`,
          data: null
        });
      }

      res.status(200).json({
        status: 'success',
        message: `${entityName} updated successfully.`,
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  };

  return {
    createOne,
    getAll,
    getById,
    updateById
  };
};

module.exports = {
  createCrudController
};
