require('dotenv').config();

const app = require('./app');
const { testDatabaseConnection } = require('./config/db');

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  await testDatabaseConnection();

  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
