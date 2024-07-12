const { comparePassword } = require('../helpers/bcryptjs')
const { signToken } = require('../helpers/jwt')
const { User, Plant, User_Plants } = require('../models')

class UserController {
    static async userLogin(req, res, next){
        try {
            let {email, password} = req.body
            if(!email || !password) throw({name: "InvalidInput"})
            
            let user = await User.findOne({where: { email }})
            if(!user || !comparePassword(password, user.password)) throw({name: "InvalidUser"})
            
            res.status(200).json({ access_token: signToken( { id: user.id } )})
        } catch (error) {
            next(error)
        }
    }

    static async userRegister(req,res,next){
        try {
            let {email, password, avatar, skill, fullName} = req.body
            
            let user = await User.create({email, password, avatar, skill, fullName})
            
            res.status(201).json({
                id: user.id,
                email: user.email
            })
        } catch (error) {
            next(error)
        }
    }

    static async getUserPlants(req,res,next){
        try {
            let userPlants = await User_Plants.findAll({
                include: Plant,
                where: {
                    userId: req.user.id
                }
            })
            if(!userPlants) throw {name:"NotFound"}

            res.status(200).json(userPlants)
        } catch (error) {
            next(error)
        }
    }

    static async addUserPlant(req,res,next){
        try {
            let {plantId} = req.params

            let plant = await Plant.findOne({where: {id: plantId}})
            if(!plant) throw {name: "NotFound"}

            let userPlant = await User_Plants.create({
                userId: req.user.id,
                plantId: plant.id
            })

            res.status(201).json({
                id: userPlant.id,
                userId: userPlant.userId,
                plantId: userPlant.plantId,
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController