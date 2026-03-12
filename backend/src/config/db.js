const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString
});

const testDatabaseConnection = async () => {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set in environment variables.');
  }

  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    console.log('PostgreSQL connected successfully.');
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  testDatabaseConnection
};
