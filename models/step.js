'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Step extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Step.hasMany(models.Plant_Steps, {foreignKey: "stepId"})
    }
  }
  Step.init({
    stepName: DataTypes.STRING,
    description: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    tips: DataTypes.STRING,
    videoLink: DataTypes.STRING,
    stepNumber: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Step',
  });
  return Step;
};