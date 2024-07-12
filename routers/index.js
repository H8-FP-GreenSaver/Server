const express = require('express')
const router = express.Router()
const userRouter = require('./user')
const plantRouter = require('./plant')
const ErrorHandler = require('../middlewares/ErrorHandler')
const authentication = require('../middlewares/authentication')

router.use('/users', userRouter)
router.use('/plants', plantRouter)

router.use(ErrorHandler)

module.exports = router