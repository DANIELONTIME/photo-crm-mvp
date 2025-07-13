const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log('🚀 ================================');
  console.log(`📍 Servidor rodando em http://localhost:${PORT}` );
  console.log(`🏥 Health check: http://localhost:${PORT}/health` );
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('🚀 ================================');
});
