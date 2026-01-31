const AuthUser = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createTokens = (user) => {
  const payload = { id: user._id, role_id: user.employeeInfo.approvalLevel };

  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "5h",
  });

  return { accessToken, refreshToken };
};



const loginUser = async ({ username, password }) => {
  const user = await AuthUser.findOne({ username });
  console.log("user: ",user)
  if (!user) throw new Error("User not found");
  console.log('login service:',password,user.passwordHash)
  // const valid = await bcrypt.compare(password, user.passwordHash);
  // if (!valid) throw new Error("Invalid credentials");

  const tokens = createTokens(user);
  return {  tokens };
};

module.exports = {
  loginUser,
};
