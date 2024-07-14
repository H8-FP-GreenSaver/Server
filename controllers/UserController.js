const { comparePassword } = require("../helpers/bcryptjs");
const { signToken } = require("../helpers/jwt");
const { User, Plant, User_Plants, Category } = require("../models");

class UserController {
  static async userLogin(req, res, next) {
    try {
      let { email, password } = req.body;
      if (!email || !password) throw { name: "InvalidInput" };

      let user = await User.findOne({ where: { email } });
      if (!user || !comparePassword(password, user.password))
        throw { name: "InvalidUser" };

      res.status(200).json({ access_token: signToken({ id: user.id }) });
    } catch (error) {
      next(error);
    }
  }

  static async userRegister(req, res, next) {
    try {
      let { email, password, avatar, skill, fullName } = req.body;

      let user = await User.create({
        email,
        password,
        avatar,
        skill,
        fullName,
      });

      res.status(201).json({
        id: user.id,
        email: user.email,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserProfile(req, res, next) {
    try {
      const { email } = req.user;
      const findUser = await User.findOne({
        where: { email },
        attributes: { exclude: ["password"] },
      });

      if (!findUser) {
        throw { name: "NotFound" };
      }

      res.status(200).json(findUser);
    } catch (error) {
      next(error);
    }
  }

  static async getUserPlants(req, res, next) {
    try {
      let userPlants = await User_Plants.findAll({
        include: {
          model: Plant,
          include: Category,
        },
        where: {
          userId: req.user.id,
        },
        order: [[Plant, Category, "id", "ASC"]],
      });

      const groupedByCategory = userPlants.reduce((acc, userPlant) => {
        const categoryId = userPlant.Plant.Category.id;
        if (!acc[categoryId]) {
            acc[categoryId] = [];
        }
        acc[categoryId].push(userPlant);
        return acc;
    }, {});

    res.status(200).json(groupedByCategory);
    
    } catch (error) {
      next(error);
    }
  }

  static async getUserPlantById(req, res, next) {
    try {
      const { id } = req.params;
      const plantDetail = await User_Plants.findOne({ 
        where: { 
          plantId: id,
          userId: req.user.id
        }, 
        include: Plant 
      });

      if (!plantDetail) throw { name: "NotFound" };
      res.status(200).json(plantDetail)

    } catch (error) {
      next(error)
    }
  }

  static async deleteUserPlantById(req, res, next) {
    try {
      const { id } = req.params;

      const plantDetail = await User_Plants.findOne({ 
        where: { 
          plantId: id,
          userId: req.user.id
        }, 
      });

      if (!plantDetail) throw { name: "NotFound" };
      
      await plantDetail.destroy();
      res.status(200).json({message: "Successfully deleted!"})

    } catch (error) {
      next(error)
    }
  }

  static async addUserPlant(req, res, next) {
    try {
      let { plantId } = req.params;

      let plant = await Plant.findOne({ where: { id: plantId } });
      if (!plant) throw { name: "NotFound" };

      let userPlant = await User_Plants.create({
        userId: req.user.id,
        plantId: plant.id,
      });

      res.status(201).json({
        id: userPlant.id,
        userId: userPlant.userId,
        plantId: userPlant.plantId,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
