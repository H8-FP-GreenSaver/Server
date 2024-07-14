const { Plant_Steps, Plant, Step } = require("../models");

class StepController {
  static async getPlantSteps(req, res, next) {
    try {
      let { id } = req.params;

      let plantSteps = await Plant_Steps.findAll({
        include: [
          {
            model: Plant,
          },
          {
            model: Step,
          },
        ],
        where: {
          plantId: id,
        },
        order: [["id", "ASC"]],
      });

      res.status(200).json(plantSteps);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = StepController;
