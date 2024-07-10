'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Plants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User_Plants.belongsTo(models.User, {foreignKey: "userId"})
      User_Plants.belongsTo(models.Plant, {foreignKey: "plantId"})
    }
  }
  User_Plants.init({
    userId: DataTypes.INTEGER,
    plantId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User_Plants',
  });
  return User_Plants;
};