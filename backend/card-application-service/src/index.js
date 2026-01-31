require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const cardApplicationRoutes = require("./routes/cardApplication.routes");

const app = express();
app.use(express.json());

// DB
connectDB();

// Routes
app.use("/card", cardApplicationRoutes);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Card Application Service running on port ${PORT}`);
});
