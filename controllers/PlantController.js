const { Plant, Category } = require("../models");
const { Sequelize } = require("sequelize");

class PlantController {
  static async getAllPlants(req, res, next) {
    try {
      let { search } = req.query;

      let plant = {};
      if (search) {
        plant = {
          plantName: {
            [Sequelize.Op.iLike]: `%${search}%`,
          },
        };
      }

      let plants = await Plant.findAll({
        where: plant,
        include: Category,
      });
      if (!plants) throw { name: "NotFound" };

      res.status(200).json(plants);
    } catch (error) {
      next(error);
    }
  }

  static async getPlantById(req, res, next) {
    try {
      let { id } = req.params;

      let plant = await Plant.findByPk(id, {
        include: Category,
      });

      res.status(200).json(plant);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PlantController;
