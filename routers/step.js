const express = require('express')
const StepController = require('../controllers/StepController')
const router = express.Router()

router.get('/:id', StepController.getPlantSteps)

module.exports = router