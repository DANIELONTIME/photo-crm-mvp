const Client = require('../models/client');
const { Op } = require('sequelize');

const clientController = {
  // CREATE - Adicionar novo cliente
  async create(req, res) {
    try {
      const { name, email, phone, address, notes, status } = req.body;
      const userId = req.user.id; // Vem do middleware de autenticação

      // Validações básicas
      if (!name || name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Nome é obrigatório e deve ter pelo menos 2 caracteres'
        });
      }

      // Verificar se já existe cliente com mesmo email para este usuário
      if (email) {
        const existingClient = await Client.findOne({
          where: {
            email: email.toLowerCase(),
            userId: userId
          }
        });

        if (existingClient) {
          return res.status(400).json({
            success: false,
            message: 'Já existe um cliente com este email'
          });
        }
      }

      // Criar cliente
      const client = await Client.create({
        name: name.trim(),
        email: email ? email.toLowerCase() : null,
        phone: phone ? phone.trim() : null,
        address: address ? address.trim() : null,
        notes: notes ? notes.trim() : null,
        status: status || 'active',
        userId: userId
      });

      res.status(201).json({
        success: true,
        message: 'Cliente criado com sucesso',
        data: { client }
      });

    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      
      // Tratamento de erros de validação do Sequelize
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors.map(err => err.message)
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // READ - Listar todos os clientes do usuário
  async list(req, res) {
    try {
      const userId = req.user.id;
      const { search, status, page = 1, limit = 10 } = req.query;

      // Construir filtros
      const where = { userId };

      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { phone: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (status) {
        where.status = status;
      }

      // Calcular offset para paginação
      const offset = (parseInt(page) - 1) * parseInt(limit);

      // Buscar clientes
      const { count, rows: clients } = await Client.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: offset,
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          clients,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / parseInt(limit))
          }
        }
      });

    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // READ - Buscar cliente específico
  async getById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const client = await Client.findOne({
        where: {
          id: id,
          userId: userId
        }
      });

      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }

      res.json({
        success: true,
        data: { client }
      });

    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // UPDATE - Editar cliente
  async update(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { name, email, phone, address, notes, status } = req.body;

      // Buscar cliente
      const client = await Client.findOne({
        where: {
          id: id,
          userId: userId
        }
      });

      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }

      // Validações
      if (name && name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Nome deve ter pelo menos 2 caracteres'
        });
      }

      // Verificar email duplicado (se mudou)
      if (email && email.toLowerCase() !== client.email) {
        const existingClient = await Client.findOne({
          where: {
            email: email.toLowerCase(),
            userId: userId,
            id: { [Op.ne]: id }
          }
        });

        if (existingClient) {
          return res.status(400).json({
            success: false,
            message: 'Já existe um cliente com este email'
          });
        }
      }

      // Atualizar dados
      const updateData = {};
      if (name !== undefined) updateData.name = name.trim();
      if (email !== undefined) updateData.email = email ? email.toLowerCase() : null;
      if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;
      if (address !== undefined) updateData.address = address ? address.trim() : null;
      if (notes !== undefined) updateData.notes = notes ? notes.trim() : null;
      if (status !== undefined) updateData.status = status;

      await client.update(updateData);

      res.json({
        success: true,
        message: 'Cliente atualizado com sucesso',
        data: { client }
      });

    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors.map(err => err.message)
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // DELETE - Remover cliente
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Buscar cliente
      const client = await Client.findOne({
        where: {
          id: id,
          userId: userId
        }
      });

      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }

      // Remover cliente
      await client.destroy();

      res.json({
        success: true,
        message: 'Cliente removido com sucesso'
      });

    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Estatísticas dos clientes
  async stats(req, res) {
    try {
      const userId = req.user.id;

      const [total, active, inactive] = await Promise.all([
        Client.count({ where: { userId } }),
        Client.count({ where: { userId, status: 'active' } }),
        Client.count({ where: { userId, status: 'inactive' } })
      ]);

      res.json({
        success: true,
        data: {
          total,
          active,
          inactive
        }
      });

    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
};

module.exports = clientController;