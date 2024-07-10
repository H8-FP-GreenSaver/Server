const express = require('express')
const UserController = require('../controllers/UserController')
const router = express.Router()

router.post('/login', UserController.userLogin)
router.post('/register', UserController.userRegister)

module.exports = router