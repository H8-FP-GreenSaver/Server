const express = require('express')
const PestController = require('../controllers/PestController')
const router = express.Router()

router.get('/', PestController.getAllPests)
router.get('/:id', PestController.getPestById)


module.exports = router