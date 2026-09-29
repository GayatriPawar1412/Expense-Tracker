const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const transactionRoutes = require("./routes/transactionRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/transactions", transactionRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });

app.get("/", (req, res) => {
  res.send("Expense Tracker Backend is Running!");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});