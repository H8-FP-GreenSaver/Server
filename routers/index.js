const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const plantRouter = require("./plant");
const pestRouter = require("./pest");
const stepRouter = require("./step");
const uploadRouter = require("./upload");
const ErrorHandler = require("../middlewares/ErrorHandler");
const authentication = require("../middlewares/authentication");

router.use("/users", userRouter);

router.use(authentication);
router.use("/forums", uploadRouter);
router.use("/plants", plantRouter);
router.use("/pests", pestRouter);
router.use("/steps", stepRouter);

router.use(ErrorHandler);

module.exports = router;
