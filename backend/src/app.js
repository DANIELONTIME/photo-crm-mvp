const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { testConnection } = require('./config/database');

const app = express();

// Testar conexão com banco na inicialização
testConnection();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
  res.json({
    message: 'Photo CRM API funcionando!',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Health check com teste de banco
app.get('/health', async (req, res) => {
  try {
    const { sequelize } = require('./config/database');
    await sequelize.authenticate();
    
    res.json({
      status: 'OK',
      message: 'Photo CRM API funcionando!',
      database: 'Conectado',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Erro na conexão com banco',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = app;
