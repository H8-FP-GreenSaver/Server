'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Plant_Steps extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Plant_Steps.belongsTo(models.Step, {foreignKey: "stepId"})
      Plant_Steps.belongsTo(models.Plant, {foreignKey: "plantId"})
    }
  }
  Plant_Steps.init({
    plantId: DataTypes.INTEGER,
    stepId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Plant_Steps',
  });
  return Plant_Steps;
};