const express = require('express')
const UserController = require('../controllers/UserController')
const router = express.Router()
const authentication = require('../middlewares/authentication')

router.post('/login', UserController.userLogin)
router.post('/register', UserController.userRegister)

router.use(authentication)
router.get('/home', UserController.getUserPlants)
router.get('/user-preferences', UserController.getUserPreferences)
router.post('/user-preferences/add', UserController.addUserPreferences)
router.get('/user-profile', UserController.getUserProfile)
router.put('/user-profile/edit-profile', UserController.updateUserProfile)
router.patch('/user-profile/update-skill', UserController.updateUserSkill)
router.get('/plant-detail/:id', UserController.getUserPlantById)
router.delete('/plant-detail/:id', UserController.deleteUserPlantById)
router.post('/add-plant/:plantId', UserController.addUserPlant)

module.exports = router