const { pool } = require('../config/db');

const healthCheck = async (req, res, next) => {
  try {
    await pool.query('SELECT 1');

    res.status(200).json({
      status: 'ok',
      service: 'formulario-entrevistas-backend',
      database: 'connected'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  healthCheck
};
