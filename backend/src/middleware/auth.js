const jwt = require('jsonwebtoken');
const { User } = require('../../models');

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Procurar pelo "crachá" (token) no cabeçalho da requisição
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: 'Token de acesso não fornecido' 
      });
    }

    // 2. Extrair o token (remover "Bearer " do início)
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Token de acesso inválido' 
      });
    }

    // 3. Verificar se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Buscar o usuário no banco de dados
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Usuário não encontrado' 
      });
    }

    // 5. Se chegou até aqui, está tudo certo! Pode passar!
    req.user = user;
    next();
    
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token inválido' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expirado' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Erro interno do servidor' 
    });
  }
};

module.exports = authMiddleware;
