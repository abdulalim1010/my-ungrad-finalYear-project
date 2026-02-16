import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  transactionId: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  }

});

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
