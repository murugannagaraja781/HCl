const mongoose = require("mongoose");

const CardApplicationSchema = new mongoose.Schema(
  {
    cardId: {
      type: Number,
      required: true,
    },
    cardName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    pan: {
      type: String,
      required: true,
      uppercase: true,
    },
    annualIncome: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    creditScore: {
      type: Number,
      required: true,
    },
    creditLimit: {
      type: Number,
      required: true,
    },
    creditLimitType: {
      type: String,
      enum: ["fixed", "dynamic"],
      required: true,
    },

    // Approval flow
    status: {
      type: String,
      enum: ["SUBMITTED", "L1_APPROVED", "L2_APPROVED", "L3_APPROVED", "REJECTED"],
      default: "SUBMITTED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CardApplication", CardApplicationSchema);
