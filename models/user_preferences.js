'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Preferences extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User_Preferences.belongsTo(models.User, {foreignKey: "userId"})
      User_Preferences.belongsTo(models.Category, {foreignKey: "categoryId"})
    }
  }
  User_Preferences.init({
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User_Preferences',
  });
  return User_Preferences;
};