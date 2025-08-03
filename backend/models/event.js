const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Título é obrigatório'
      },
      len: {
        args: [3, 100],
        msg: 'Título deve ter entre 3 e 100 caracteres'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  eventDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Data do evento é obrigatória'
      },
      isDate: {
        msg: 'Data deve ter formato válido'
      }
    }
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Horário de início é obrigatório'
      }
    }
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Horário de fim é obrigatório'
      }
    }
  },
  eventType: {
    type: DataTypes.ENUM('session', 'meeting', 'delivery', 'other'),
    allowNull: false,
    defaultValue: 'session'
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'confirmed', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'scheduled'
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Clients',
      key: 'id'
    }
  }
}, {
  tableName: 'events',
  timestamps: true,
  validate: {
    endTimeAfterStartTime() {
      if (this.startTime && this.endTime && this.startTime >= this.endTime) {
        throw new Error('Horário de fim deve ser posterior ao horário de início');
      }
    }
  }
});

module.exports = Event;
