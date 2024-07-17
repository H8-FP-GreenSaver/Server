const express = require('express')
const PlantController = require('../controllers/PlantController')
const router = express.Router()

router.get('/', PlantController.getAllPlants)
router.get('/:id', PlantController.getPlantById)


module.exports = router