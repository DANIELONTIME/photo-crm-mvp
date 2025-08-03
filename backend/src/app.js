const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { testConnection } = require('./config/database');

// Importar rotas
const authRoutes = require('../routes/auth');
const clientRoutes = require('../routes/clients');
const eventRoutes = require('../routes/events');

const app = express();

// Testar conexão com banco na inicialização
testConnection();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/events', eventRoutes);

// Rota principal
app.get('/', (req, res) => {
  res.json({
    message: 'Photo CRM API funcionando!',
    status: 'OK',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile',
        verify: 'GET /api/auth/verify'
      },
      clients: {
        list: 'GET /api/clients',
        create: 'POST /api/clients',
        update: 'PUT /api/clients/:id',
        delete: 'DELETE /api/clients/:id'
      },
      events: {
        list: 'GET /api/events',
        create: 'POST /api/events',
        update: 'PUT /api/events/:id',
        delete: 'DELETE /api/events/:id',
        stats: 'GET /api/events/stats'
      }
    }
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

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Middleware para tratamento de erros
app.use((error, req, res, next) => {
  console.error('Erro:', error);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado'
  });
});

module.exports = app;
