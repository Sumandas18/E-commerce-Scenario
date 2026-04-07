const express = require("express");
const combineController = require("../controller/combineController");
const router = express.Router();


router.get("/q21", combineController.q21)
router.get("/q22", combineController.q22)
router.get("/q23", combineController.q23)
router.get("/q24", combineController.q24)
router.get("/q25", combineController.q25)
router.get("/q26", combineController.q26)
router.get("/q27", combineController.q27)
router.get("/q28", combineController.q28)
router.get("/q29", combineController.q29)
router.get("/q30", combineController.q30)


module.exports = router;