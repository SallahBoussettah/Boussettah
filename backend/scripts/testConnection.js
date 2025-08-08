require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log('Testing database connection...');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 'undefined');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: console.log
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection successful');
    return sequelize.close();
  })
  .then(() => {
    console.log('Connection closed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  });