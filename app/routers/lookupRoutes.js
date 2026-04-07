const express = require("express");
const lookupController = require("../controller/lookupController");
const router  = express.Router();



router.get("/q1", lookupController.q1)
router.get("/q2", lookupController.q2)
router.get("/q3", lookupController.q3)
router.get("/q4", lookupController.q4)
router.get("/q5", lookupController.q5)
router.get("/q6", lookupController.q6)
router.get("/q7", lookupController.q7)
router.get("/q8", lookupController.q8)
router.get("/q9", lookupController.q9)
router.get("/q10", lookupController.q10)

module.exports = router;