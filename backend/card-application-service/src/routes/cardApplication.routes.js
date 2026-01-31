const express = require("express");
const router = express.Router();
const controller = require("../controllers/cardApplication.controller");

// Submit application
router.post("/submit", controller.submitApplication);

// Get application by PAN
router.get("/status/:pan", controller.getApplicationByPan);

// L1 / L2 / L3 approval
router.put("/approve/:id", controller.updateApplicationStatus);

module.exports = router;
