const express = require("express");
const Transaction = require("../models/Transaction");

const router = express.Router();

// Get all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add transaction
router.post("/", async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    const savedTransaction = await transaction.save();

    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update transaction
router.put("/:id", async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete transaction
router.delete("/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;