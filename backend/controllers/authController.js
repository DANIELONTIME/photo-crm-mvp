const { User } = require('../models');
const { generateToken } = require('../src/utils/jwt');

class AuthController {
  // Registro de usuário
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Nome, email e senha são obrigatórios'
        });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email já está cadastrado'
        });
      }

      const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password
      });

      const token = generateToken(user.id);

      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        data: { user: user.toSafeObject(), token }
      });

    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Login de usuário
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email e senha são obrigatórios'
        });
      }

      const user = await User.findOne({ 
        where: { email: email.toLowerCase().trim() } 
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email ou senha incorretos'
        });
      }

      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Email ou senha incorretos'
        });
      }

      const token = generateToken(user.id);

      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: { user: user.toSafeObject(), token }
      });

    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Perfil do usuário autenticado
  async profile(req, res) {
    try {
      res.json({
        success: true,
        data: { user: req.user.toSafeObject() }
      });
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = new AuthController();
