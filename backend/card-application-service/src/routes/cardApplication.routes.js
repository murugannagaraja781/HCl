const express = require("express");
const router = express.Router();
const controller = require("../controllers/cardApplication.controller");

// Submit application
router.post("/", controller.submitApplication);

// Cooldown check
router.get("/previous", controller.checkPrevious);

// Get application status
router.get("/status", controller.getApplicationStatus);

// List applications (Admin/Manager)
router.get("/", controller.getApplications);

// Update application (Approve/Reject)
router.patch("/:id", controller.updateApplication);

module.exports = router;
