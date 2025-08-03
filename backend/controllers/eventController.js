const Event = require('../models/event');
const Client = require('../models/client');
const { Op } = require('sequelize');

const eventController = {
  // Criar novo evento
  async create(req, res) {
    try {
      const { 
        title, 
        description, 
        eventDate, 
        startTime, 
        endTime, 
        eventType, 
        status, 
        location, 
        notes, 
        clientId 
      } = req.body;
      
      // Validações básicas
      if (!title || !eventDate || !startTime || !endTime) {
        return res.status(400).json({
          success: false,
          message: 'Título, data, horário de início e fim são obrigatórios'
        });
      }

      // Verificar conflito de horário
      const conflictingEvent = await Event.findOne({
        where: {
          userId: req.user.id,
          eventDate,
          status: { [Op.not]: 'cancelled' },
          [Op.or]: [
            {
              startTime: { [Op.between]: [startTime, endTime] }
            },
            {
              endTime: { [Op.between]: [startTime, endTime] }
            },
            {
              [Op.and]: [
                { startTime: { [Op.lte]: startTime } },
                { endTime: { [Op.gte]: endTime } }
              ]
            }
          ]
        }
      });

      if (conflictingEvent) {
        return res.status(409).json({
          success: false,
          message: 'Conflito de horário detectado',
          conflictingEvent: {
            id: conflictingEvent.id,
            title: conflictingEvent.title,
            startTime: conflictingEvent.startTime,
            endTime: conflictingEvent.endTime
          }
        });
      }

      // Verificar se cliente existe (se fornecido)
      if (clientId) {
        const client = await Client.findOne({
          where: { id: clientId, userId: req.user.id }
        });
        
        if (!client) {
          return res.status(404).json({
            success: false,
            message: 'Cliente não encontrado'
          });
        }
      }

      const event = await Event.create({
        title,
        description,
        eventDate,
        startTime,
        endTime,
        eventType: eventType || 'session',
        status: status || 'scheduled',
        location,
        notes,
        userId: req.user.id,
        clientId: clientId || null
      });

      res.status(201).json({
        success: true,
        message: 'Evento criado com sucesso',
        data: { event }
      });
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Listar eventos do usuário
  async list(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        startDate, 
        endDate, 
        eventType, 
        status, 
        clientId 
      } = req.query;
      
      const offset = (page - 1) * limit;

      // Construir filtros
      const where = { userId: req.user.id };
      
      if (startDate && endDate) {
        where.eventDate = {
          [Op.between]: [startDate, endDate]
        };
      } else if (startDate) {
        where.eventDate = {
          [Op.gte]: startDate
        };
      } else if (endDate) {
        where.eventDate = {
          [Op.lte]: endDate
        };
      }

      if (eventType) {
        where.eventType = eventType;
      }

      if (status) {
        where.status = status;
      }

      if (clientId) {
        where.clientId = clientId;
      }

      const { count, rows: events } = await Event.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['eventDate', 'ASC'], ['startTime', 'ASC']]
      });

      res.json({
        success: true,
        data: {
          events,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Erro ao listar eventos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Buscar evento por ID
  async getById(req, res) {
    try {
      const { id } = req.params;

      const event = await Event.findOne({
        where: { 
          id,
          userId: req.user.id 
        }
      });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Evento não encontrado'
        });
      }

      res.json({
        success: true,
        data: { event }
      });
    } catch (error) {
      console.error('Erro ao buscar evento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Atualizar evento
  async update(req, res) {
    try {
      const { id } = req.params;
      const { 
        title, 
        description, 
        eventDate, 
        startTime, 
        endTime, 
        eventType, 
        status, 
        location, 
        notes, 
        clientId 
      } = req.body;

      const event = await Event.findOne({
        where: { 
          id,
          userId: req.user.id 
        }
      });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Evento não encontrado'
        });
      }

      await event.update({
        title: title || event.title,
        description: description !== undefined ? description : event.description,
        eventDate: eventDate || event.eventDate,
        startTime: startTime || event.startTime,
        endTime: endTime || event.endTime,
        eventType: eventType || event.eventType,
        status: status || event.status,
        location: location !== undefined ? location : event.location,
        notes: notes !== undefined ? notes : event.notes,
        clientId: clientId !== undefined ? clientId : event.clientId
      });

      res.json({
        success: true,
        message: 'Evento atualizado com sucesso',
        data: { event }
      });
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Deletar evento
  async delete(req, res) {
    try {
      const { id } = req.params;

      const event = await Event.findOne({
        where: { 
          id,
          userId: req.user.id 
        }
      });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Evento não encontrado'
        });
      }

      await event.destroy();

      res.json({
        success: true,
        message: 'Evento removido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Estatísticas dos eventos
  async stats(req, res) {
    try {
      const total = await Event.count({
        where: { userId: req.user.id }
      });

      const scheduled = await Event.count({
        where: { 
          userId: req.user.id,
          status: 'scheduled'
        }
      });

      const confirmed = await Event.count({
        where: { 
          userId: req.user.id,
          status: 'confirmed'
        }
      });

      const completed = await Event.count({
        where: { 
          userId: req.user.id,
          status: 'completed'
        }
      });

      res.json({
        success: true,
        data: {
          total,
          scheduled,
          confirmed,
          completed
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

module.exports = eventController;
