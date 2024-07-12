const {Plant, Category} = require('../models')

class PlantController {
    static async getAllPlants(req,res,next){
        try {
            let plants = await Plant.findAll({
                include: Category
            })
            if(!plants) throw {name:"NotFound"}

            res.status(200).json(plants)
        } catch (error) {
            next(error)
        }
    }

    static async getPlantById(req,res,next){
        try {
            let {id} = req.params

            let plant = await Plant.findByPk(id, {
                include: Category
            })

            res.status(200).json(plant)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = PlantController