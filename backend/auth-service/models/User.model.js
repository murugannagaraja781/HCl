const mongoose = require("mongoose");

const authUserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: String,
  passwordHash: String,
  role: { type: String, enum: ["user", "bank_employee"], default: "user" },
  status: { type: String, default: "active" },
  employeeInfo: {
    employeeId: String,
    approvalLevel: Number,
    department: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  "AuthUser",
  authUserSchema,
  "auth"   // 👈 exact collection name
);
