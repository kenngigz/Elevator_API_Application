const express = require("express");
const router = express.Router();
const { elevatorController } = require("../controllers/elevatorController");

router.route("/").post(elevatorController.callElevator);

module.exports = router;
