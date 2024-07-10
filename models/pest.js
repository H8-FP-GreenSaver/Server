'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pest.belongsTo(models.Plant, {foreignKey: "plantId"})
    }
  }
  Pest.init({
    pestName: DataTypes.STRING,
    description: DataTypes.STRING,
    dangerLevel: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING,
    plantId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Pest',
  });
  return Pest;
};