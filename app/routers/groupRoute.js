const express = require("express");
const groupController = require("../controller/groupController");
const router  = express.Router();


router.get("/q11", groupController.q11)
router.get("/q12", groupController.q12)
router.get("/q13", groupController.q13)
router.get("/q14", groupController.q14)
router.get("/q15", groupController.q15)
router.get("/q16", groupController.q16)
router.get("/q17", groupController.q17)
router.get("/q18", groupController.q18)
router.get("/q19", groupController.q19)
router.get("/q20", groupController.q20)


module.exports = router;