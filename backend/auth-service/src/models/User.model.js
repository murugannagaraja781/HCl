const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "bank_employee"],
      required: true
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    employeeInfo: {
      employeeId: String,
      approvalLevel: Number, // 1,2,3
      department: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
