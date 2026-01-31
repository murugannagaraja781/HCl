const authService = require("../services/auth.services");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { user, tokens } = await authService.loginUser({ username, password });

    res.status(200).json({ user, tokens });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { login };
