'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Associações serão adicionadas depois
      // User.hasMany(models.Client, { foreignKey: 'userId' });
      // User.hasMany(models.Event, { foreignKey: 'userId' });
    }

    // Método para verificar senha
    async checkPassword(password) {
      return bcrypt.compare(password, this.password);
    }

    // Método para retornar dados seguros (sem senha)
    toSafeObject() {
      return {
        id: this.id,
        name: this.name,
        email: this.email,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      };
    }
  }
  
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Nome é obrigatório'
        },
        len: {
          args: [2, 100],
          msg: 'Nome deve ter entre 2 e 100 caracteres'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Este email já está cadastrado'
      },
      validate: {
        isEmail: {
          msg: 'Email deve ter formato válido'
        },
        notEmpty: {
          msg: 'Email é obrigatório'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 100],
          msg: 'Senha deve ter pelo menos 6 caracteres'
        },
        notEmpty: {
          msg: 'Senha é obrigatória'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    hooks: {
      // Criptografar senha antes de criar usuário
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
      // Criptografar senha antes de atualizar usuário
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      }
    }
  });
  
  return User;
};
