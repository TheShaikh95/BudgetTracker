const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Enter a name for transaction"
    },
    amount: {
      type: Number,
      required: "Enter an amount"
    },
    type: {
      type: String,
      required: "Enter the type"
    },
    date: {
      type: Date,
      default: Date.now
    }
  }
);

const Transaction = mongoose.model("transactions", transactionSchema);

module.exports = Transaction;