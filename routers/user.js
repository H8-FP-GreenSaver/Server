const express = require('express')
const UserController = require('../controllers/UserController')
const router = express.Router()
const authentication = require('../middlewares/authentication')

router.post('/login', UserController.userLogin)
router.post('/register', UserController.userRegister)

router.use(authentication)
router.get('/user-profile', UserController.getUserProfile)
router.get('/home', UserController.getUserPlants)
router.get('/plant-detail/:id', UserController.getUserPlantById)
router.delete('/plant-detail/:id', UserController.deleteUserPlantById)
router.post('/add-plant/:plantId', UserController.addUserPlant)

module.exports = router