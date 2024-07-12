const {Pest, Plant} = require('../models')

class PestController {
    static async getAllPests(req,res,next){
        try {
            let pests = await Pest.findAll({
                include: Plant
            })
            if(!pests) throw {name:"NotFound"}

            res.status(200).json(pests)
        } catch (error) {
            next(error)
        }
    }

    static async getPestById(req,res,next){
        try {
            let {id} = req.params

            let pest = await Pest.findByPk(id, {
                include: Plant
            })

            res.status(200).json(pest)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = PestController