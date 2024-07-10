'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Plant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Plant.hasMany(models.User_Plants, {foreignKey: "plantId"})
      Plant.hasMany(models.Plant_Steps, {foreignKey: "plantId"})
      Plant.hasMany(models.Pest, {foreignKey: "plantId"})
      Plant.belongsTo(models.Category, {foreignKey: "categoryId"})
    }
  }
  Plant.init({
    plantName: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    estimatePrice: DataTypes.INTEGER,
    estimateWater: DataTypes.INTEGER,
    estimateTemperature: DataTypes.INTEGER,
    difficulty: DataTypes.INTEGER,
    description: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    wateringTime: DataTypes.INTEGER,
    medium: DataTypes.STRING,
    plantArea: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Plant',
  });
  return Plant;
};