'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.belongsToMany(models.Permission, {
        foreignKey: 'role_id',
        through: 'role_permission',
      });

      Role.belongsToMany(models.User, {
        foreignKey: 'role_id',
        through: 'user_role',
      });
    }
  }
  Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      }
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'roles',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Role;
};