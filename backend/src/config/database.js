const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'photo_crm_mvp',
    process.env.DB_USER || 'photo_user',
    process.env.DB_PASSWORD || 'dev123456',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
    }
  );
}

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com PostgreSQL estabelecida com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar com PostgreSQL:', error.message);
  }
}

module.exports = { sequelize, testConnection };
