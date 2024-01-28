'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Provider extends Model {
    static associate(models) {
      Provider.hasMany(models.User, {
        foreignKey: "provider_id",
      })
    }
  }
  Provider.init(
    {
      id:{
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
      modelName: 'Provider',
      tableName: 'providers',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Provider;
};