const { comparePassword } = require('../helpers/bcryptjs')
const { signToken } = require('../helpers/jwt')
const { User } = require('../models')

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
}

module.exports = UserController