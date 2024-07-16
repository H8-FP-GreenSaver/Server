const express = require('express');
const router = express.Router();
const upload = require('../helpers/multerConfig');
const UploadImage = require('../controllers/UploadImage');

router.post('/', upload.single('file'), UploadImage.uploadImage);

module.exports = router;