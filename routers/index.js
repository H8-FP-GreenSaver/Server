const express = require('express')
const router = express.Router()
const userRouter = require('./user')
const ErrorHandler = require('../middlewares/ErrorHandler')

router.use('/users', userRouter)

router.use(ErrorHandler)

module.exports = router