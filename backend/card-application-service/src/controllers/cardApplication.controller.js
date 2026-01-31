const CardApplication = require("../models/CardApplication.model");

/**
 * Submit new card application
 */
exports.submitApplication = async (req, res) => {
  try {
    //  const applicationData = {
    //   ...req.body,
    //   userId: userId,              // attach owner
    //   status: "PENDING_L1",        // default workflow state
    // };
    const application = await CardApplication.create(req.body);

    res.status(201).json({
      message: "Card application submitted successfully",
      data: application,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to submit application",
      error: error.message,
    });
  }
};

/**
 * Get application status by PAN
 */
exports.getApplicationByPan = async (req, res) => {
  try {
    const { pan } = req.params;

    const application = await CardApplication.findOne({ pan });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Approve application (L1 / L2 / L3)
 */
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await CardApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.json({
      message: "Application status updated",
      data: application,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
